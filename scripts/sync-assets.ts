/** Valida o acervo e sincroniza os assets publicados para public/hqs/. */
import path from "node:path";
import { loadContent } from "../src/lib/content";
import { syncAssets } from "../src/lib/sync";

const { hqs, errors, warnings } = loadContent();
for (const w of warnings) console.warn(`aviso: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`erro:  ${e}`);
  console.error(`\nSincronização cancelada: corrija os ${errors.length} erro(s) acima (npm run validate).`);
  process.exit(1);
}

const r = syncAssets(hqs, path.join(process.cwd(), "public", "hqs"));
for (const f of r.copiados) console.log(`copiado:    ${f}`);
for (const f of r.atualizados) console.log(`atualizado: ${f}`);
for (const f of r.removidos) console.log(`removido:   ${f}`);
console.log(
  `assets: ${r.copiados.length} copiado(s), ${r.atualizados.length} atualizado(s), ` +
    `${r.removidos.length} removido(s), ${r.inalterados} inalterado(s).`,
);
