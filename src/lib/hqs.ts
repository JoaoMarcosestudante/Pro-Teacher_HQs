/**
 * Funções puras sobre o acervo: busca, filtros, ordenação e relacionadas.
 * Não acessa o sistema de arquivos — pode ser usado no navegador (galeria).
 */

/** Dados mínimos de uma HQ para listagem (serializáveis para Client Components). */
export interface HqResumo {
  slug: string;
  titulo: string;
  subtitulo?: string;
  sinopse?: string;
  temas: string[];
  autores?: string[];
  ano: number;
  areaConhecimento?: string;
  capaUrl: string;
  capaAlt: string;
}

export interface Filtros {
  q?: string;
  temas?: string[];
  area?: string;
}

/** Minúsculas, sem acentos, espaços normalizados. */
export function normalizar(valor: string | undefined | null): string {
  return (valor ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();
}

export function compararHqs(
  a: Pick<HqResumo, "ano" | "titulo">,
  b: Pick<HqResumo, "ano" | "titulo">,
): number {
  return b.ano - a.ano || a.titulo.localeCompare(b.titulo, "pt-BR");
}

export function ordenar<T extends Pick<HqResumo, "ano" | "titulo" | "slug">>(hqs: readonly T[]): T[] {
  return [...hqs].sort((a, b) => compararHqs(a, b) || a.slug.localeCompare(b.slug));
}

function textoBusca(hq: HqResumo): string {
  return normalizar(
    [hq.titulo, hq.subtitulo, hq.sinopse, ...(hq.autores ?? []), ...hq.temas, hq.areaConhecimento].join(" "),
  );
}

/** Todas as palavras da busca precisam aparecer em algum campo. */
export function correspondeBusca(hq: HqResumo, q: string | undefined): boolean {
  const termos = normalizar(q).split(" ").filter(Boolean);
  if (termos.length === 0) return true;
  const alvo = textoBusca(hq);
  return termos.every((t) => alvo.includes(t));
}

/**
 * Busca E área E (qualquer um dos temas selecionados).
 * Dentro do filtro de temas a lógica é "OU": marcar mais temas amplia o resultado.
 */
export function filtrar(hqs: readonly HqResumo[], { q, temas = [], area }: Filtros): HqResumo[] {
  const temasN = new Set(temas.map(normalizar));
  const areaN = normalizar(area);
  return hqs.filter(
    (hq) =>
      correspondeBusca(hq, q) &&
      (!areaN || normalizar(hq.areaConhecimento) === areaN) &&
      (temasN.size === 0 || hq.temas.some((t) => temasN.has(normalizar(t)))),
  );
}

/** Valores distintos com contagem, em ordem alfabética. */
export function contarValores(valores: Iterable<string | undefined>): { valor: string; total: number }[] {
  const mapa = new Map<string, { valor: string; total: number }>();
  for (const v of valores) {
    if (!v) continue;
    const chave = normalizar(v);
    const atual = mapa.get(chave);
    if (atual) atual.total++;
    else mapa.set(chave, { valor: v, total: 1 });
  }
  return [...mapa.values()].sort((a, b) => a.valor.localeCompare(b.valor, "pt-BR"));
}

/** Até `limite` HQs com mais temas em comum; desempate pela ordenação padrão. */
export function relacionadas<T extends Pick<HqResumo, "slug" | "temas" | "ano" | "titulo">>(
  atual: T,
  todas: readonly T[],
  limite = 3,
): T[] {
  const temasAtual = new Set(atual.temas.map(normalizar));
  return todas
    .filter((h) => h.slug !== atual.slug)
    .map((h) => ({ h, comuns: h.temas.filter((t) => temasAtual.has(normalizar(t))).length }))
    .filter((x) => x.comuns > 0)
    .sort((a, b) => b.comuns - a.comuns || compararHqs(a.h, b.h) || a.h.slug.localeCompare(b.h.slug))
    .slice(0, limite)
    .map((x) => x.h);
}
