/**
 * Schema único dos metadados das HQs (hqs/<slug>/meta.json).
 * Usado pelo site (build) e pelos scripts de validação/sincronização — não duplicar regras.
 * Este módulo não acessa o sistema de arquivos: é seguro importá-lo em qualquer contexto.
 */
import { z } from "zod";

z.config(z.locales.pt());

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Domínios aceitos para flipbooks. Subdomínios são aceitos por regra de sufixo com ponto. */
export const FLIPBOOK_HOSTS = ["heyzine.com"] as const;

export const COVER_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"] as const;

/** Marcadores de conteúdo pendente: proibidos em HQ publicada, aceitos em rascunho. */
const PLACEHOLDER_RE = /^\s*(TODO|TBD|A DEFINIR|A CONFIRMAR)\b/i;

const ANO_MIN = 2025;

export function isValidSlug(value: string): boolean {
  return SLUG_RE.test(value);
}

/** Apenas um nome de arquivo simples, sem pastas, sem ".." e sem caracteres especiais. */
export function isSafeFileName(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,150}$/.test(value) && !value.includes("..");
}

export function isAllowedFlipbookUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
  const host = url.hostname.toLowerCase();
  return FLIPBOOK_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

const texto = (max: number) => z.string().trim().min(1, "não pode ser vazio").max(max);

const listaUnica = (item: z.ZodString, min: number, max: number) =>
  z
    .array(item)
    .min(min)
    .max(max)
    .refine((xs) => new Set(xs.map((x) => x.toLocaleLowerCase("pt-BR"))).size === xs.length, {
      message: "contém itens repetidos",
    });

const nomeArquivo = (extensoes: readonly string[]) =>
  z
    .string()
    .refine(isSafeFileName, { message: "use apenas o nome do arquivo (sem pastas, espaços ou acentos)" })
    .refine((v) => extensoes.some((ext) => v.toLowerCase().endsWith(ext)), {
      message: `extensão deve ser ${extensoes.join(", ")}`,
    });

export const metaSchema = z
  .strictObject({
    titulo: texto(120),
    subtitulo: texto(200).optional(),
    sinopse: texto(400).optional(),
    temas: listaUnica(texto(40), 1, 5),
    areaConhecimento: texto(60).optional(),
    publicoAlvo: texto(60).optional(),
    autores: listaUnica(texto(80), 1, 20).optional(),
    ano: z
      .number()
      .int()
      .min(ANO_MIN)
      .max(new Date().getFullYear() + 1),
    idioma: z
      .string()
      .regex(/^[a-z]{2}(-[A-Z]{2})?$/, "use um código como pt-BR")
      .default("pt-BR"),
    capa: nomeArquivo(COVER_EXTENSIONS),
    capaAlt: texto(400),
    pdf: nomeArquivo([".pdf"]),
    flipbookUrl: z
      .string()
      .refine(isAllowedFlipbookUrl, {
        message: `precisa ser https em um domínio permitido (${FLIPBOOK_HOSTS.join(", ")})`,
      })
      .optional(),
    /** Regra editorial do projeto: todas as HQs da oficina foram feitas com apoio de IA. */
    geradaComIA: z.boolean().default(true),
    licenca: texto(80).optional(),
    /** Obrigatório e explícito: ausência não pode significar publicação. */
    publicada: z.boolean({ message: "obrigatório (true ou false)" }),
  })
  .superRefine((meta, ctx) => {
    if (!meta.publicada) return;
    const campos: [string, string | undefined][] = [
      ["titulo", meta.titulo],
      ["subtitulo", meta.subtitulo],
      ["sinopse", meta.sinopse],
      ["capaAlt", meta.capaAlt],
      ...meta.temas.map((t, i) => [`temas.${i}`, t] as [string, string]),
      ...(meta.autores ?? []).map((a, i) => [`autores.${i}`, a] as [string, string]),
    ];
    for (const [campo, valor] of campos) {
      if (valor !== undefined && PLACEHOLDER_RE.test(valor)) {
        ctx.addIssue({
          code: "custom",
          path: campo.split(".").map((p) => (/^\d+$/.test(p) ? Number(p) : p)),
          message: "contém marcador de pendência (TODO/A confirmar) em HQ publicada",
        });
      }
    }
  });

export type HqMeta = z.infer<typeof metaSchema>;

/** Converte erros do Zod no formato: [hqs/<slug>/meta.json] campo "<campo>": <problema> */
export function formatIssues(origem: string, error: z.ZodError): string[] {
  return error.issues.flatMap((issue) => {
    if (issue.code === "unrecognized_keys") {
      return issue.keys.map((k) => `[${origem}] campo "${k}": campo desconhecido`);
    }
    const campo = issue.path.length ? issue.path.join(".") : "(raiz)";
    return [`[${origem}] campo "${campo}": ${issue.message}`];
  });
}
