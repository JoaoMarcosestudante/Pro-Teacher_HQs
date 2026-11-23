import { describe, expect, it } from "vitest";
import { contarValores, filtrar, normalizar, ordenar, relacionadas, type HqResumo } from "../src/lib/hqs";

const hq = (
  slug: string,
  titulo: string,
  ano: number,
  temas: string[],
  extra: Partial<HqResumo> = {},
): HqResumo => ({
  slug,
  titulo,
  ano,
  temas,
  capaUrl: `/hqs/${slug}/capa.webp`,
  capaAlt: "capa",
  ...extra,
});

const acervo = [
  hq("palavras", "Palavras Machucam", 2026, ["Bullying", "Respeito", "Empatia"], { autores: ["Josiane"] }),
  hq("arua", "Aruã e a Linguagem dos Símbolos", 2026, ["Cultura indígena", "Tecnologia"], {
    areaConhecimento: "Humanidades",
  }),
  hq("recreio", "Respeito no Recreio", 2025, ["Bullying", "Respeito", "Amizade"]),
  hq("missao", "Missão Verde", 2026, ["Educação ambiental"], { areaConhecimento: "Ciências" }),
];

describe("normalizar", () => {
  it("ignora acentos, caixa e espaços extras", () => {
    expect(normalizar("  AruÃ   e  a Missão ")).toBe("arua e a missao");
    expect(normalizar(undefined)).toBe("");
  });
});

describe("ordenar", () => {
  it("ano decrescente e título alfabético (pt-BR)", () => {
    expect(ordenar(acervo).map((h) => h.slug)).toEqual(["arua", "missao", "palavras", "recreio"]);
  });
  it("é determinística e não altera a entrada", () => {
    const copia = [...acervo];
    ordenar(acervo);
    expect(acervo).toEqual(copia);
  });
});

describe("filtrar", () => {
  it("busca por título sem diferenciar acentos", () => {
    expect(filtrar(acervo, { q: "arua" }).map((h) => h.slug)).toEqual(["arua"]);
    expect(filtrar(acervo, { q: "MISSAO" }).map((h) => h.slug)).toEqual(["missao"]);
  });
  it("busca por autor e por tema; todas as palavras precisam aparecer", () => {
    expect(filtrar(acervo, { q: "josiane" }).map((h) => h.slug)).toEqual(["palavras"]);
    expect(filtrar(acervo, { q: "respeito amizade" }).map((h) => h.slug)).toEqual(["recreio"]);
  });
  it("temas combinam por OU; área e busca por E", () => {
    expect(filtrar(acervo, { temas: ["Amizade", "Tecnologia"] }).map((h) => h.slug)).toEqual([
      "arua",
      "recreio",
    ]);
    expect(filtrar(acervo, { temas: ["Tecnologia"], area: "Ciências" })).toEqual([]);
    expect(filtrar(acervo, { q: "verde", area: "ciencias" }).map((h) => h.slug)).toEqual(["missao"]);
  });
  it("busca vazia retorna tudo; sem resultado retorna lista vazia", () => {
    expect(filtrar(acervo, { q: "   " })).toHaveLength(4);
    expect(filtrar(acervo, { q: "inexistente" })).toEqual([]);
  });
});

describe("relacionadas", () => {
  it("prioriza temas em comum e exclui a própria HQ", () => {
    expect(relacionadas(acervo[0]!, acervo).map((h) => h.slug)).toEqual(["recreio"]);
  });
  it("retorna vazio quando não há temas em comum", () => {
    expect(relacionadas(acervo[3]!, acervo)).toEqual([]);
  });
});

describe("contarValores", () => {
  it("agrupa sem diferenciar acentos/caixa e ignora vazios", () => {
    expect(contarValores(["Bullying", "bullying", undefined, "Amizade"])).toEqual([
      { valor: "Amizade", total: 1 },
      { valor: "Bullying", total: 2 },
    ]);
  });
});
