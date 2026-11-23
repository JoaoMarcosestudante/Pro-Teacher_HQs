import type { Metadata } from "next";
import { CopyButton } from "@/components/ClientButtons";
import { EXEMPLO_META } from "@/content/textos";
import { PDF_MAX_BYTES, PDF_WARN_BYTES, formatBytes } from "@/lib/content";
import { COVER_EXTENSIONS } from "@/lib/schema";
import { REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contribuir",
  description: "Como adicionar uma nova HQ ao acervo Pro-Teacher: pasta, metadados, capa e PDF.",
  alternates: { canonical: "/contribuir" },
};

const exemplo = JSON.stringify(EXEMPLO_META, null, 2);

const CAMPOS: [string, string][] = [
  ["titulo", "Título da HQ (obrigatório)."],
  ["subtitulo, sinopse", "Opcionais. Sinopse com até 400 caracteres."],
  ["temas", "De 1 a 5 temas, sem repetição (obrigatório)."],
  ["areaConhecimento, publicoAlvo", "Opcionais; ativam filtros e informações na página."],
  ["autores", "Nomes como devem aparecer publicamente (opcional, mas recomendado)."],
  ["ano", "Ano de criação (obrigatório)."],
  ["capa, capaAlt", "Nome do arquivo da capa e a descrição dela para leitores de tela (obrigatórios)."],
  ["pdf", "Nome do arquivo PDF (obrigatório)."],
  ["flipbookUrl", "Opcional: endereço https do flipbook no Heyzine."],
  ["licenca", "Opcional: licença escolhida pelos autores (ex.: CC BY-NC-SA 4.0)."],
  ["publicada", "Obrigatório: true para aparecer no site, false para manter como rascunho."],
];

export default function ContribuirPage() {
  return (
    <div className="grid max-w-3xl gap-10">
      <header className="grid gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contribuir com uma HQ</h1>
        <p className="text-muted text-lg">
          Fez uma HQ com a metodologia Pro-Teacher? Ela entra no site sem nenhuma mudança no código: basta uma
          pasta com os arquivos certos.
        </p>
      </header>

      <section aria-labelledby="passos" className="grid gap-3">
        <h2 id="passos" className="text-2xl font-bold">
          Passo a passo
        </h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Crie uma pasta <code>hqs/&lt;slug&gt;/</code>. O <em>slug</em> é o endereço da HQ: letras
            minúsculas, sem acentos, palavras separadas por hífen (ex.:{" "}
            <code>missao-verde-a-viagem-da-consciencia</code>). Se já existir uma HQ com o mesmo título,
            acrescente o nome do autor.
          </li>
          <li>
            Adicione a capa: <code>capa.webp</code> (também aceitos: {COVER_EXTENSIONS.join(", ")}), de
            preferência com cerca de 600 px de largura.
          </li>
          <li>
            Adicione o PDF da HQ. Recomendado: até {formatBytes(PDF_WARN_BYTES)}; o limite máximo aceito é{" "}
            {formatBytes(PDF_MAX_BYTES)}.
          </li>
          <li>
            Crie o arquivo <code>meta.json</code> seguindo o exemplo abaixo e troque todos os valores pelos da
            sua HQ.
          </li>
          <li>
            Se puder, rode <code>npm run validate</code> para conferir. Depois abra um <em>pull request</em>{" "}
            no{" "}
            <a className="prose-link" href={REPO_URL} rel="noopener noreferrer">
              repositório
            </a>
            . Se preferir, abra uma <em>issue</em> e a equipe ajuda.
          </li>
        </ol>
      </section>

      <section aria-labelledby="exemplo" className="grid gap-3">
        <h2 id="exemplo" className="text-2xl font-bold">
          Exemplo de meta.json
        </h2>
        <p>Todos os valores abaixo são de exemplo e precisam ser substituídos.</p>
        <pre className="border-line bg-surface overflow-x-auto rounded-xl border p-4 text-sm">
          <code>{exemplo}</code>
        </pre>
        <p>
          <CopyButton text={exemplo} label="Copiar exemplo" />
        </p>
        <dl className="grid gap-2">
          {CAMPOS.map(([campo, desc]) => (
            <div key={campo}>
              <dt className="font-mono text-sm font-semibold">{campo}</dt>
              <dd className="text-muted">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="regras" className="grid gap-3">
        <h2 id="regras" className="text-2xl font-bold">
          Antes de enviar
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Não inclua dados pessoais de estudantes</strong> (nomes reais, fotos, escolas
            identificáveis de alunos) na HQ nem nos metadados.
          </li>
          <li>Confirme que todos os autores autorizam a publicação.</li>
          <li>
            Escreva um texto alternativo (<code>capaAlt</code>) que descreva a capa para quem usa leitor de
            tela.
          </li>
          <li>
            Textos como <code>TODO</code> ou <code>A confirmar</code> só são aceitos em HQs com{" "}
            <code>&quot;publicada&quot;: false</code>.
          </li>
          <li>
            Veja todos os detalhes em{" "}
            <a
              className="prose-link"
              href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
              rel="noopener noreferrer"
            >
              CONTRIBUTING.md
            </a>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
