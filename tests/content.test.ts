import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadContent, PDF_MAX_BYTES, type Hq } from "../src/lib/content";
import { syncAssets } from "../src/lib/sync";

const FIXTURE = path.join(__dirname, "fixtures", "hqs", "hq-de-teste");

let tmp: string;
let root: string;

/** Copia a fixture para hqs/<slug> e aplica alterações no meta.json. */
function criarHq(slug: string, meta: Record<string, unknown> = {}) {
  const dir = path.join(root, slug);
  fs.cpSync(FIXTURE, dir, { recursive: true });
  const atual = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify({ ...atual, ...meta }));
  return dir;
}

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "proteacher-"));
  root = path.join(tmp, "hqs");
  fs.mkdirSync(root);
});
afterEach(() => fs.rmSync(tmp, { recursive: true, force: true }));

describe("loadContent", () => {
  it("descobre HQs válidas com tamanho real do PDF", () => {
    criarHq("hq-de-teste");
    const r = loadContent(root);
    expect(r.errors).toEqual([]);
    expect(r.hqs).toHaveLength(1);
    expect(r.hqs[0]!.slug).toBe("hq-de-teste");
    expect(r.hqs[0]!.pdfBytes).toBe(fs.statSync(path.join(FIXTURE, "hq-de-teste.pdf")).size);
  });

  it("acervo inexistente ou vazio é um estado válido", () => {
    expect(loadContent(path.join(tmp, "nao-existe"))).toEqual({ hqs: [], errors: [], warnings: [] });
    expect(loadContent(root).hqs).toEqual([]);
  });

  it("acumula erros de várias HQs", () => {
    criarHq("hq-um", { titulo: "" });
    criarHq("hq-dois", { campoNovo: true });
    criarHq("Pasta Invalida");
    const r = loadContent(root);
    expect(r.hqs).toEqual([]);
    expect(r.errors.join("\n")).toContain('[hqs/hq-um/meta.json] campo "titulo"');
    expect(r.errors.join("\n")).toContain('[hqs/hq-dois/meta.json] campo "campoNovo": campo desconhecido');
    expect(r.errors.join("\n")).toContain("[hqs/Pasta Invalida/] nome de pasta inválido");
  });

  it("detecta arquivo inexistente e JSON inválido", () => {
    criarHq("sem-pdf", { pdf: "outro.pdf" });
    fs.writeFileSync(path.join(criarHq("json-ruim"), "meta.json"), "{ titulo: ");
    const erros = loadContent(root).errors.join("\n");
    expect(erros).toContain('[hqs/sem-pdf/meta.json] campo "pdf": arquivo "outro.pdf" não encontrado');
    expect(erros).toContain("[hqs/json-ruim/meta.json] JSON inválido");
  });

  it("verifica a assinatura do arquivo, não só a extensão", () => {
    const dir = criarHq("pdf-falso");
    fs.writeFileSync(path.join(dir, "hq-de-teste.pdf"), "isto não é um pdf");
    expect(loadContent(root).errors.join()).toContain("não corresponde a um arquivo .pdf");
  });

  it("recusa links simbólicos", () => {
    const dir = criarHq("com-link");
    fs.rmSync(path.join(dir, "capa.png"));
    fs.symlinkSync(path.join(FIXTURE, "capa.png"), path.join(dir, "capa.png"));
    expect(loadContent(root).errors.join()).toContain("precisa ser um arquivo comum");
  });

  it("rejeita PDF acima do limite (arquivo esparso, sem ocupar disco)", () => {
    const dir = criarHq("pdf-grande");
    const pdf = path.join(dir, "hq-de-teste.pdf");
    fs.truncateSync(pdf, PDF_MAX_BYTES + 1);
    expect(loadContent(root).errors.join()).toMatch(/excede o limite de 95,0 MB/);
  });

  it("avisa sobre arquivos soltos na raiz de hqs/", () => {
    fs.writeFileSync(path.join(root, "solto.pdf"), "%PDF-");
    expect(loadContent(root).warnings.join()).toContain("[hqs/solto.pdf] ignorado");
  });
});

describe("syncAssets", () => {
  const sincronizar = (hqs: Hq[]) => syncAssets(hqs, path.join(tmp, "public", "hqs"));

  it("copia só a capa das publicadas (PDF fica no GitHub), ignora rascunhos e é idempotente", () => {
    criarHq("publicada");
    criarHq("rascunho", { publicada: false, titulo: "TODO" });
    const { hqs } = loadContent(root);
    const r1 = sincronizar(hqs);
    expect(r1.copiados).toEqual(["publicada/capa.png"]);
    expect(fs.existsSync(path.join(tmp, "public", "hqs", "rascunho"))).toBe(false);

    const r2 = sincronizar(hqs);
    expect(r2).toMatchObject({ copiados: [], atualizados: [], removidos: [], inalterados: 1 });
  });

  it("remove assets obsoletos sem tocar em nada fora do diretório gerenciado", () => {
    criarHq("fica");
    const publicHqs = path.join(tmp, "public", "hqs");
    fs.mkdirSync(path.join(publicHqs, "despublicada"), { recursive: true });
    fs.writeFileSync(path.join(publicHqs, "despublicada", "x.pdf"), "x");
    const externo = path.join(tmp, "public", "favicon.ico");
    fs.writeFileSync(externo, "manter");

    const r = sincronizar(loadContent(root).hqs);
    expect(r.removidos).toEqual(["despublicada"]);
    expect(fs.readFileSync(externo, "utf8")).toBe("manter");
  });

  it("recusa destino que não seja .../hqs", () => {
    expect(() => syncAssets([], path.join(tmp, "public"))).toThrow(/inesperado/);
  });
});
