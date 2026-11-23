/**
 * Copia a capa das HQs publicadas para public/hqs/<slug>/ e remove o que ficou obsoleto.
 * Os PDFs NÃO entram no deploy: são servidos pelo GitHub (ver docs/DECISOES.md, D15).
 * public/hqs/ é inteiramente gerenciado por este módulo (está no .gitignore).
 * Nada fora desse diretório é tocado; links simbólicos encontrados são removidos sem seguir o alvo.
 */
import fs from "node:fs";
import path from "node:path";
import type { Hq } from "./content";

export interface SyncReport {
  copiados: string[];
  atualizados: string[];
  removidos: string[];
  inalterados: number;
}

function assertInside(base: string, alvo: string) {
  const rel = path.relative(base, alvo);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Recusado: "${alvo}" não está dentro de "${base}"`);
  }
}

function remover(base: string, alvo: string, report: SyncReport) {
  assertInside(base, alvo);
  fs.rmSync(alvo, { recursive: true, force: true });
  report.removidos.push(path.relative(base, alvo));
}

export function syncAssets(hqs: readonly Hq[], destino: string): SyncReport {
  const report: SyncReport = { copiados: [], atualizados: [], removidos: [], inalterados: 0 };
  const base = path.resolve(destino);
  if (path.basename(base) !== "hqs") {
    throw new Error(`Diretório de destino inesperado: ${base} (esperado .../hqs)`);
  }
  fs.mkdirSync(base, { recursive: true });

  const desejado = new Map<string, Map<string, string>>();
  for (const hq of hqs) {
    if (!hq.publicada) continue;
    desejado.set(hq.slug, new Map([[hq.capa, hq.arquivos.capa]]));
  }

  // 1. Remover pastas/arquivos que não pertencem mais ao conjunto publicado.
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const alvo = path.join(base, entry.name);
    const arquivos = desejado.get(entry.name);
    if (!arquivos || !entry.isDirectory() || entry.isSymbolicLink()) {
      remover(base, alvo, report);
      continue;
    }
    for (const f of fs.readdirSync(alvo, { withFileTypes: true })) {
      if (!arquivos.has(f.name) || !f.isFile()) remover(base, path.join(alvo, f.name), report);
    }
  }

  // 2. Copiar o que falta ou mudou (comparação por tamanho e data de modificação).
  for (const [slug, arquivos] of desejado) {
    const pasta = path.join(base, slug);
    fs.mkdirSync(pasta, { recursive: true });
    for (const [nome, origem] of arquivos) {
      const alvo = path.join(pasta, nome);
      assertInside(base, alvo);
      const src = fs.statSync(origem);
      const dst = fs.existsSync(alvo) ? fs.statSync(alvo) : null;
      // Tolerância de 1 ms: sistemas de arquivos diferem na precisão do mtime.
      if (dst && dst.size === src.size && Math.abs(dst.mtimeMs - src.mtimeMs) < 1) {
        report.inalterados++;
        continue;
      }
      fs.copyFileSync(origem, alvo);
      // Segundos numéricos preservam a fração; objetos Date arredondariam para o ms.
      fs.utimesSync(alvo, src.atimeMs / 1000, src.mtimeMs / 1000);
      (dst ? report.atualizados : report.copiados).push(path.relative(base, alvo));
    }
  }
  return report;
}
