/** Valida todo o acervo em hqs/. Sai com código 1 se houver erro. */
import { loadContent } from "../src/lib/content";

const { hqs, errors, warnings } = loadContent();

for (const w of warnings) console.warn(`aviso: ${w}`);
for (const e of errors) console.error(`erro:  ${e}`);

const publicadas = hqs.filter((h) => h.publicada).length;
console.log(
  `\n${hqs.length} HQ(s) válida(s): ${publicadas} publicada(s), ${hqs.length - publicadas} não publicada(s). ` +
    `${errors.length} erro(s), ${warnings.length} aviso(s).`,
);
if (errors.length) process.exit(1);
