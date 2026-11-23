/**
 * Descoberta e validação do acervo em hqs/. Executa apenas no servidor/build (usa node:fs).
 * Compartilhado por: scripts/validate-content.ts, scripts/sync-assets.ts e páginas do site.
 */
import fs from "node:fs";
import path from "node:path";
import { formatIssues, isValidSlug, metaSchema, type HqMeta } from "./schema";

export const PDF_WARN_BYTES = 25 * 1024 * 1024;
export const PDF_MAX_BYTES = 95 * 1024 * 1024;

export type Hq = HqMeta & {
  slug: string;
  pdfBytes: number;
  /** Caminhos absolutos dos arquivos de origem (uso exclusivo no servidor/scripts). */
  arquivos: { capa: string; pdf: string };
};

export interface ContentResult {
  hqs: Hq[];
  errors: string[];
  warnings: string[];
}

export function defaultContentRoot(): string {
  return path.join(process.cwd(), "hqs");
}

export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1)
    return `${mb.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} MB`;
  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("pt-BR")} KB`;
}

const SIGNATURES: Record<string, (b: Buffer) => boolean> = {
  ".pdf": (b) => b.subarray(0, 5).toString("latin1") === "%PDF-",
  ".png": (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  ".jpg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  ".jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  ".webp": (b) =>
    b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP",
};

/** Lê só os primeiros bytes — nunca carrega o PDF inteiro na memória. */
function readHeader(file: string): Buffer {
  const fd = fs.openSync(file, "r");
  try {
    const buf = Buffer.alloc(12);
    const n = fs.readSync(fd, buf, 0, 12, 0);
    return buf.subarray(0, n);
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * Resolve um arquivo referenciado no meta.json, garantindo que ele fique dentro da pasta da HQ,
 * seja um arquivo regular (não diretório nem link simbólico) e tenha a assinatura esperada.
 */
function checkFile(dir: string, nome: string, campo: string, origem: string, errors: string[]) {
  const alvo = path.resolve(dir, nome);
  const rel = path.relative(dir, alvo);
  if (rel.startsWith("..") || path.isAbsolute(rel) || rel.includes(path.sep)) {
    errors.push(`[${origem}] campo "${campo}": caminho fora da pasta da HQ`);
    return null;
  }
  let stat: fs.Stats;
  try {
    stat = fs.lstatSync(alvo);
  } catch {
    errors.push(`[${origem}] campo "${campo}": arquivo "${nome}" não encontrado`);
    return null;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    errors.push(`[${origem}] campo "${campo}": "${nome}" precisa ser um arquivo comum`);
    return null;
  }
  const ext = path.extname(nome).toLowerCase();
  const assinaturaOk = SIGNATURES[ext]?.(readHeader(alvo)) ?? false;
  if (!assinaturaOk) {
    errors.push(`[${origem}] campo "${campo}": o conteúdo de "${nome}" não corresponde a um arquivo ${ext}`);
    return null;
  }
  return { path: alvo, size: stat.size };
}

function loadOne(root: string, slug: string, errors: string[], warnings: string[]): Hq | null {
  const dir = path.join(root, slug);
  const origem = `hqs/${slug}/meta.json`;
  const metaPath = path.join(dir, "meta.json");

  let raw: unknown;
  try {
    const st = fs.lstatSync(metaPath);
    if (!st.isFile()) throw new Error();
    raw = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch (e) {
    errors.push(
      e instanceof SyntaxError
        ? `[${origem}] JSON inválido: ${e.message}`
        : `[hqs/${slug}/] arquivo meta.json ausente ou ilegível`,
    );
    return null;
  }

  const parsed = metaSchema.safeParse(raw);
  if (!parsed.success) {
    errors.push(...formatIssues(origem, parsed.error));
    return null;
  }
  const meta = parsed.data;

  const errosAntes = errors.length;
  const capa = checkFile(dir, meta.capa, "capa", origem, errors);
  const pdf = checkFile(dir, meta.pdf, "pdf", origem, errors);
  if (!capa || !pdf || errors.length > errosAntes) return null;

  if (pdf.size > PDF_MAX_BYTES) {
    errors.push(
      `[${origem}] campo "pdf": ${formatBytes(pdf.size)} excede o limite de ${formatBytes(PDF_MAX_BYTES)}`,
    );
    return null;
  }
  if (pdf.size > PDF_WARN_BYTES) {
    warnings.push(
      `[${origem}] campo "pdf": ${formatBytes(pdf.size)} — arquivo pesado para conexões móveis (aviso a partir de ${formatBytes(PDF_WARN_BYTES)})`,
    );
  }

  return { ...meta, slug, pdfBytes: pdf.size, arquivos: { capa: capa.path, pdf: pdf.path } };
}

/** Lê e valida todo o acervo, acumulando erros de todas as HQs. */
export function loadContent(root: string = defaultContentRoot()): ContentResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const hqs: Hq[] = [];

  // turbopackIgnore: o acervo só é lido no build (todas as rotas são estáticas); sem isto o
  // rastreamento incluiria os PDFs no pacote das funções do servidor.
  if (!fs.existsSync(/*turbopackIgnore: true*/ root)) return { hqs, errors, warnings };

  const entries = fs.readdirSync(/*turbopackIgnore: true*/ root, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    if (!entry.isDirectory()) {
      warnings.push(`[hqs/${entry.name}] ignorado: cada HQ deve estar em uma pasta própria`);
      continue;
    }
    if (!isValidSlug(entry.name)) {
      errors.push(
        `[hqs/${entry.name}/] nome de pasta inválido: use minúsculas sem acentos, palavras separadas por hífen (ex.: minha-hq)`,
      );
      continue;
    }
    const hq = loadOne(root, entry.name, errors, warnings);
    if (hq) hqs.push(hq);
  }
  return { hqs, errors, warnings };
}
