import Image from "next/image";
import Link from "next/link";
import type { HqResumo } from "@/lib/hqs";

/** Proporção A4 das HQs exportadas do Canva (595×842 pt). */
export const COVER_W = 600;
export const COVER_H = 849;

export function HqCard({ hq, headingLevel = 3 }: { hq: HqResumo; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group border-line bg-surface relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      {/* alt="" porque o título logo abaixo já nomeia o link (técnica WCAG H2); a descrição completa
          da capa (capaAlt) aparece na página da HQ. */}
      <Image
        src={hq.capaUrl}
        alt=""
        width={COVER_W}
        height={COVER_H}
        sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
        className="bg-surface-2 aspect-[600/849] w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Heading className="text-base leading-snug font-bold">
          <Link
            href={`/hqs/${hq.slug}`}
            className="after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:outline-none"
          >
            {hq.titulo}
          </Link>
        </Heading>
        <p className="text-muted text-sm">
          {hq.autores?.length ? hq.autores.join(", ") : "Autoria a confirmar"} · {hq.ano}
          {hq.areaConhecimento ? ` · ${hq.areaConhecimento}` : ""}
        </p>
        <p className="text-muted mt-auto pt-1 text-xs">{hq.temas.join(" · ")}</p>
      </div>
    </article>
  );
}

export function HqGrid({ hqs }: { hqs: HqResumo[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {hqs.map((hq) => (
        <li
          key={hq.slug}
          className="has-[a:focus-visible]:outline-primary rounded-xl has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2"
        >
          <HqCard hq={hq} />
        </li>
      ))}
    </ul>
  );
}
