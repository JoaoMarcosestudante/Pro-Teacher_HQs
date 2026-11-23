import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FlipbookReader, ShareButton } from "@/components/ClientButtons";
import { COVER_H, COVER_W, HqCard } from "@/components/HqGrid";
import { AVISO_IA } from "@/content/textos";
import {
  assetUrl,
  getPublishedHq,
  getPublishedHqs,
  githubUrl,
  pdfDownloadUrl,
  pdfViewUrl,
  toResumo,
} from "@/lib/catalog";
import { formatBytes } from "@/lib/content";
import { relacionadas } from "@/lib/hqs";
import { getSiteUrl, licencaEfetiva } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedHqs().map((hq) => ({ slug: hq.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function descricao(hq: { sinopse?: string; subtitulo?: string; titulo: string; temas: string[] }) {
  return hq.sinopse ?? hq.subtitulo ?? `HQ pedagógica sobre ${hq.temas.join(", ").toLowerCase()}.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hq = getPublishedHq((await params).slug);
  if (!hq) return {};
  const capa = assetUrl(hq, hq.capa);
  const description = descricao(hq);
  return {
    title: hq.titulo,
    description,
    alternates: { canonical: `/hqs/${hq.slug}` },
    openGraph: {
      type: "article",
      title: hq.titulo,
      description,
      images: [{ url: capa, width: COVER_W, height: COVER_H, alt: hq.capaAlt }],
    },
    twitter: { card: "summary_large_image", title: hq.titulo, description, images: [capa] },
  };
}

const IDIOMAS: Record<string, string> = { "pt-BR": "Português (Brasil)", en: "Inglês", es: "Espanhol" };
const PDF_PESADO = 10 * 1024 * 1024;

export default async function HqPage({ params }: Props) {
  const hq = getPublishedHq((await params).slug);
  if (!hq) notFound();

  const site = getSiteUrl();
  const pdfUrl = pdfDownloadUrl(hq);
  const capaUrl = assetUrl(hq, hq.capa);
  const tamanho = formatBytes(hq.pdfBytes);
  const licenca = licencaEfetiva(hq.licenca);
  const outras = relacionadas(hq, getPublishedHqs()).map(toResumo);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    genre: "História em quadrinhos",
    name: hq.titulo,
    ...(hq.subtitulo && { alternativeHeadline: hq.subtitulo }),
    ...(hq.sinopse && { abstract: hq.sinopse }),
    ...(hq.autores && { author: hq.autores.map((name) => ({ "@type": "Person", name })) }),
    dateCreated: String(hq.ano),
    inLanguage: hq.idioma,
    keywords: hq.temas.join(", "),
    ...(hq.publicoAlvo && { audience: { "@type": "EducationalAudience", educationalRole: hq.publicoAlvo } }),
    ...(licenca && { license: licenca }),
    image: `${site}${capaUrl}`,
    url: `${site}/hqs/${hq.slug}`,
    encoding: {
      "@type": "MediaObject",
      contentUrl: pdfUrl,
      encodingFormat: "application/pdf",
      contentSize: tamanho,
    },
  };

  const detalhes: [string, string][] = [
    ["Autoria", hq.autores?.join(", ") ?? "A confirmar"],
    ["Ano", String(hq.ano)],
    ...(hq.areaConhecimento ? ([["Área do conhecimento", hq.areaConhecimento]] as [string, string][]) : []),
    ...(hq.publicoAlvo ? ([["Público-alvo", hq.publicoAlvo]] as [string, string][]) : []),
    ["Idioma", IDIOMAS[hq.idioma] ?? hq.idioma],
    ["Licença", licenca ?? "Ainda não definida pelos autores"],
  ];

  return (
    <article className="grid gap-10">
      <script
        type="application/ld+json"
        // JSON.stringify + escape de "<" impede o fechamento prematuro da tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Trilha" className="text-sm">
        <Link href="/#acervo" className="prose-link">
          ← Voltar ao acervo
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        <Image
          src={capaUrl}
          alt={hq.capaAlt}
          width={COVER_W}
          height={COVER_H}
          sizes="(min-width: 768px) 320px, 100vw"
          preload
          className="border-line bg-surface-2 mx-auto w-full max-w-sm rounded-xl border shadow-sm"
        />

        <div className="grid content-start gap-5">
          <header className="grid gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{hq.titulo}</h1>
            {hq.subtitulo && <p className="text-muted text-lg">{hq.subtitulo}</p>}
          </header>

          {hq.sinopse && <p>{hq.sinopse}</p>}

          <ul className="flex flex-wrap gap-2" aria-label="Temas">
            {hq.temas.map((t) => (
              <li key={t}>
                <Link href={`/?tema=${encodeURIComponent(t)}#acervo`} className="chip hover:underline">
                  {t}
                </Link>
              </li>
            ))}
          </ul>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {detalhes.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-2">
            <div className="flex flex-wrap gap-2">
              <a href={pdfUrl} className="btn-primary" rel="noopener noreferrer">
                Baixar PDF · {tamanho}
              </a>
              <a href={pdfViewUrl(hq)} className="btn-secondary" rel="noopener noreferrer">
                Ler no GitHub
              </a>
            </div>
            <p className="text-muted text-sm">
              Os arquivos ficam no{" "}
              <a href={githubUrl(hq)} className="prose-link" rel="noopener noreferrer">
                repositório público no GitHub
              </a>
              .{hq.pdfBytes > PDF_PESADO && ` Arquivo grande: em dados móveis, prefira baixar usando Wi-Fi.`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <ShareButton title={hq.titulo} />
            </div>
          </div>

          {hq.geradaComIA && (
            <p className="border-accent bg-surface-2 rounded-r-lg border-l-4 px-4 py-2 text-sm">{AVISO_IA}</p>
          )}
        </div>
      </div>

      {hq.flipbookUrl && (
        <section aria-labelledby="leitura" className="grid gap-3">
          <h2 id="leitura" className="text-2xl font-bold">
            Leitura interativa
          </h2>
          <FlipbookReader url={hq.flipbookUrl} title={hq.titulo} />
        </section>
      )}

      {outras.length > 0 && (
        <section aria-labelledby="relacionadas" className="grid gap-4">
          <h2 id="relacionadas" className="text-2xl font-bold">
            HQs com temas em comum
          </h2>
          <ul className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:grid-cols-3">
            {outras.map((o) => (
              <li key={o.slug}>
                <HqCard hq={o} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
