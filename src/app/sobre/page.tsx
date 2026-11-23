import type { Metadata } from "next";
import { CopyButton } from "@/components/ClientButtons";
import {
  CITACAO,
  CONCEITO,
  EQUIPE,
  ETAPAS,
  FLUXO,
  INSTITUICAO,
  LIMITACOES,
  RESULTADOS,
  USO_DE_IA,
} from "@/content/textos";
import { ARTICLE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre o projeto",
  description:
    "O que é o Pro-Teacher, como as HQs foram criadas em 8 etapas com um agente de IA, resultados da oficina e suas limitações.",
  alternates: { canonical: "/sobre" },
};

function Secao({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-3">
      <h2 id={id} className="text-2xl font-bold">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

export default function SobrePage() {
  return (
    <div className="grid max-w-3xl gap-10">
      <header className="grid gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Sobre o Pro-Teacher</h1>
        <p className="text-muted text-lg">
          Inteligência artificial como aliada do professor, não como substituta.
        </p>
      </header>

      <Secao id="conceito" titulo="O conceito">
        {CONCEITO.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Secao>

      <Secao id="etapas" titulo="As 8 etapas do agente">
        <p>Um agente customizado guiou cada professor da intenção pedagógica até o roteiro técnico:</p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {ETAPAS.map((e, i) => (
            <li key={e.nome} className="border-line bg-surface flex gap-3 rounded-xl border p-3">
              <span
                aria-hidden="true"
                className="bg-primary text-on-primary grid size-8 shrink-0 place-items-center rounded-full font-bold"
              >
                {i + 1}
              </span>
              <span>
                <strong className="block">{e.nome}</strong>
                <span className="text-muted text-sm">{e.descricao}</span>
              </span>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao id="fluxo" titulo="Como foi a oficina">
        <ol className="flex flex-wrap items-center gap-2" aria-label="Etapas da oficina, em ordem">
          {FLUXO.map((f, i) => (
            <li key={f} className="flex items-center gap-2">
              <span className="chip font-semibold">{f}</span>
              {i < FLUXO.length - 1 && (
                <span aria-hidden="true" className="text-muted">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <p>
          Depois das 8 etapas, cada professor fez o acabamento no Canva (diagramação, balões e onomatopeias) e
          publicou o resultado como flipbook no Heyzine.
        </p>
      </Secao>

      <Secao id="resultados" titulo="Resultados informados">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="text-muted pb-2 text-left text-sm">
              Medidas autorrelatadas pelos participantes, em escala de 1 a 5.
            </caption>
            <thead>
              <tr className="border-line border-b">
                <th scope="col" className="py-2 pr-4">
                  Indicador
                </th>
                <th scope="col" className="py-2 text-right">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody>
              {RESULTADOS.map(([k, v]) => (
                <tr key={k} className="border-line border-b">
                  <th scope="row" className="py-2 pr-4 font-normal">
                    {k}
                  </th>
                  <td className="py-2 text-right font-semibold">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-accent bg-surface-2 grid gap-2 rounded-xl border-l-8 p-4" role="note">
          <h3 className="text-lg font-bold">Limitações da pesquisa</h3>
          <p>Os resultados indicam boa receptividade, mas devem ser lidos com cautela:</p>
          <ul className="list-disc space-y-1 pl-6">
            {LIMITACOES.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </Secao>

      <Secao id="ia" titulo="Uso de IA e privacidade">
        <ul className="list-disc space-y-2 pl-6">
          {USO_DE_IA.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Secao>

      <Secao id="citar" titulo="Como citar">
        <blockquote className="border-line bg-surface rounded-xl border p-4 text-sm">{CITACAO}</blockquote>
        <p className="flex flex-wrap items-center gap-3">
          <CopyButton text={CITACAO} label="Copiar referência" />
          {ARTICLE_URL && (
            <a className="prose-link" href={ARTICLE_URL} rel="noopener noreferrer">
              Ler o artigo
            </a>
          )}
        </p>
      </Secao>

      <Secao id="equipe" titulo="Equipe">
        <p>{INSTITUICAO}</p>
        <ul className="list-disc pl-6">
          {EQUIPE.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Secao>
    </div>
  );
}
