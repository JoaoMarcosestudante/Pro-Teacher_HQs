/**
 * Acesso ao acervo para as páginas (somente servidor/build).
 * Falha o build se o conteúdo for inválido — o prebuild já valida, isto é a segunda barreira.
 */
import { loadContent, type Hq } from "./content";
import { ordenar, type HqResumo } from "./hqs";
import { isValidSlug } from "./schema";
import { REPO_BRANCH, REPO_RAW_URL, REPO_URL } from "./site";

let cache: Hq[] | null = null;

export function getPublishedHqs(): Hq[] {
  if (cache) return cache;
  const { hqs, errors } = loadContent();
  if (errors.length) {
    throw new Error(`Conteúdo inválido em hqs/:\n${errors.join("\n")}\nExecute "npm run validate".`);
  }
  cache = ordenar(hqs.filter((h) => h.publicada));
  return cache;
}

export function getPublishedHq(slug: string): Hq | undefined {
  if (!isValidSlug(slug)) return undefined;
  return getPublishedHqs().find((h) => h.slug === slug);
}

/** URLs públicas montadas apenas a partir de metadados já validados. */
export function assetUrl(hq: Pick<Hq, "slug">, arquivo: string): string {
  return `/hqs/${hq.slug}/${encodeURIComponent(arquivo)}`;
}

export function githubUrl(hq: Pick<Hq, "slug">): string {
  return `${REPO_URL}/tree/${REPO_BRANCH}/hqs/${hq.slug}`;
}

/** Download direto: o GitHub serve como application/octet-stream, o navegador baixa o arquivo. */
export function pdfDownloadUrl(hq: Pick<Hq, "slug" | "pdf">): string {
  return `${REPO_RAW_URL}/${REPO_BRANCH}/hqs/${hq.slug}/${encodeURIComponent(hq.pdf)}`;
}

/** Visualizador de PDF do próprio GitHub. */
export function pdfViewUrl(hq: Pick<Hq, "slug" | "pdf">): string {
  return `${REPO_URL}/blob/${REPO_BRANCH}/hqs/${hq.slug}/${encodeURIComponent(hq.pdf)}`;
}

export function toResumo(hq: Hq): HqResumo {
  return {
    slug: hq.slug,
    titulo: hq.titulo,
    subtitulo: hq.subtitulo,
    sinopse: hq.sinopse,
    temas: hq.temas,
    autores: hq.autores,
    ano: hq.ano,
    areaConhecimento: hq.areaConhecimento,
    capaUrl: assetUrl(hq, hq.capa),
    capaAlt: hq.capaAlt,
  };
}
