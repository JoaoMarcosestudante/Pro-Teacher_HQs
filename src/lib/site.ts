/** Configurações editoriais e de implantação, em um único lugar. */

export const SITE_NAME = "Pro-Teacher HQs";
export const SITE_DESCRIPTION =
  "Histórias em quadrinhos pedagógicas criadas por professores na oficina Pro-Teacher (Unifesspa), com apoio de inteligência artificial. Leia online ou baixe em PDF.";

export const REPO_URL = "https://github.com/JoaoMarcosestudante/Pro-Teacher_HQs";
/** Os PDFs são servidos pelo GitHub (não entram no deploy). Links apontam para esta branch. */
export const REPO_BRANCH = "main";
export const REPO_RAW_URL = "https://raw.githubusercontent.com/JoaoMarcosestudante/Pro-Teacher_HQs";

/** URL do artigo: manter null até existir endereço público confirmado (o link fica oculto). */
export const ARTICLE_URL: string | null = null;

/**
 * Licença global do acervo. Manter null até a definição pelos autores:
 * o site informa que a licença ainda não foi definida, sem inventar uma.
 */
export const LICENCA_GLOBAL: string | null = null;

export function licencaEfetiva(licencaHq?: string): string | null {
  return licencaHq ?? LICENCA_GLOBAL;
}

/**
 * URL canônica: NEXT_PUBLIC_SITE_URL → domínio de produção da Vercel → localhost.
 * VERCEL_PROJECT_PRODUCTION_URL aponta sempre para produção, inclusive em previews,
 * o que evita canonical com endereço de preview.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const raw = explicit || (vercel ? `https://${vercel}` : "http://localhost:3000");
  const url = new URL(raw);
  if (process.env.VERCEL_ENV === "production" && url.protocol !== "https:") {
    throw new Error(`NEXT_PUBLIC_SITE_URL deve usar https em produção (recebido: ${raw})`);
  }
  return url.origin;
}

/** Apenas o ambiente de produção deve ser indexado. Fora da Vercel (local), indexável. */
export function isIndexable(): boolean {
  const env = process.env.VERCEL_ENV;
  return !env || env === "production";
}
