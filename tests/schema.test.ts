import { describe, expect, it } from "vitest";
import { EXEMPLO_META } from "../src/content/textos";
import {
  formatIssues,
  isAllowedFlipbookUrl,
  isSafeFileName,
  isValidSlug,
  metaSchema,
} from "../src/lib/schema";

const valido = {
  titulo: "Aruã e a Linguagem dos Símbolos",
  temas: ["Cultura indígena", "Tecnologia"],
  autores: ["Romário"],
  ano: 2026,
  capa: "capa.webp",
  capaAlt: "Descrição da capa.",
  pdf: "arua.pdf",
  publicada: true,
};

const sem = (campo: keyof typeof valido) =>
  Object.fromEntries(Object.entries(valido).filter(([k]) => k !== campo));

const erros = (dados: unknown) => {
  const r = metaSchema.safeParse(dados);
  return r.success ? [] : formatIssues("hqs/x/meta.json", r.error);
};

describe("metaSchema", () => {
  it("aceita metadados válidos e aplica padrões", () => {
    const r = metaSchema.parse(valido);
    expect(r.idioma).toBe("pt-BR");
    expect(r.geradaComIA).toBe(true);
  });

  it("o exemplo exibido em /contribuir é válido", () => {
    expect(erros(EXEMPLO_META)).toEqual([]);
  });

  it("exige campo obrigatório e informa no formato padrão", () => {
    expect(erros(sem("titulo"))[0]).toMatch(/^\[hqs\/x\/meta\.json\] campo "titulo": /);
  });

  it("exige 'publicada' explícito", () => {
    expect(erros(sem("publicada")).join()).toContain('campo "publicada"');
  });

  it("rejeita campo desconhecido", () => {
    expect(erros({ ...valido, extra: 1 })).toEqual(['[hqs/x/meta.json] campo "extra": campo desconhecido']);
  });

  it("rejeita temas vazios, repetidos (sem diferenciar caixa) ou mais de 5", () => {
    expect(erros({ ...valido, temas: [] })).not.toEqual([]);
    expect(erros({ ...valido, temas: ["Bullying", "bullying"] }).join()).toContain("repetidos");
    expect(erros({ ...valido, temas: ["a", "b", "c", "d", "e", "f"] })).not.toEqual([]);
  });

  it("rejeita extensão incorreta e caminhos com pastas", () => {
    expect(erros({ ...valido, capa: "capa.gif" }).join()).toContain('campo "capa"');
    expect(erros({ ...valido, pdf: "arua.docx" }).join()).toContain('campo "pdf"');
    expect(erros({ ...valido, pdf: "../outra/arua.pdf" })).not.toEqual([]);
    expect(erros({ ...valido, capa: "/etc/capa.png" })).not.toEqual([]);
  });

  it("rejeita TODO em HQ publicada, mas aceita em rascunho", () => {
    expect(erros({ ...valido, titulo: "TODO: título" }).join()).toContain("pendência");
    expect(erros({ ...valido, autores: ["A confirmar"] }).join()).toContain('campo "autores.0"');
    expect(erros({ ...valido, titulo: "TODO: título", publicada: false })).toEqual([]);
  });

  it("não trata a palavra TODO no meio de um texto como pendência", () => {
    expect(erros({ ...valido, sinopse: "Uma história sobre o TODO e as partes." })).toEqual([]);
  });

  it("valida o ano", () => {
    expect(erros({ ...valido, ano: 1990 })).not.toEqual([]);
    expect(erros({ ...valido, ano: 2026.5 })).not.toEqual([]);
  });
});

describe("isAllowedFlipbookUrl", () => {
  it.each([
    ["https://heyzine.com/flip-book/abc.html", true],
    ["https://www.heyzine.com/flip-book/abc", true],
    ["http://heyzine.com/flip-book/abc", false],
    ["https://heyzine.com.exemplo.org/x", false],
    ["https://fakeheyzine.com/x", false],
    ["https://user:senha@heyzine.com/x", false],
    ["https://heyzine.com:8443/x", false],
    ["javascript:alert(1)", false],
    ["não é url", false],
  ])("%s → %s", (url, esperado) => {
    expect(isAllowedFlipbookUrl(url)).toBe(esperado);
  });
});

describe("slugs e nomes de arquivo", () => {
  it.each([
    ["missao-verde", true],
    ["hq2026", true],
    ["Missao-Verde", false],
    ["missão", false],
    ["-inicio", false],
    ["fim-", false],
    ["dois--hifens", false],
    ["..", false],
    ["com espaco", false],
  ])("slug %s → %s", (slug, esperado) => {
    expect(isValidSlug(slug)).toBe(esperado);
  });

  it("nomes de arquivo seguros", () => {
    expect(isSafeFileName("capa.webp")).toBe(true);
    expect(isSafeFileName("pasta/capa.webp")).toBe(false);
    expect(isSafeFileName("..capa.webp")).toBe(false);
    expect(isSafeFileName(".oculto.pdf")).toBe(false);
    expect(isSafeFileName("")).toBe(false);
  });
});
