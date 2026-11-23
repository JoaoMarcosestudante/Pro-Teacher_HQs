import Link from "next/link";
import { Suspense } from "react";
import { Gallery } from "@/components/Gallery";
import { HqGrid } from "@/components/HqGrid";
import { getPublishedHqs, toResumo } from "@/lib/catalog";

export default function HomePage() {
  const hqs = getPublishedHqs().map(toResumo);

  return (
    <div className="grid gap-10">
      <section aria-labelledby="titulo-home" className="grid max-w-3xl gap-4">
        <h1 id="titulo-home" className="text-3xl font-bold tracking-tight sm:text-4xl">
          Histórias em quadrinhos feitas por professores
        </h1>
        <p className="text-muted text-lg">
          Acervo aberto das HQs pedagógicas criadas na oficina{" "}
          <strong className="text-fg">Pro-Teacher</strong> (Unifesspa, Marabá-PA), com apoio de inteligência
          artificial e autoria dos professores. Leia online ou baixe em PDF para usar em sala de aula.
        </p>
        <p className="flex flex-wrap gap-3">
          <a href="#acervo" className="btn-primary">
            Explorar HQs
          </a>
          <Link href="/sobre" className="btn-secondary">
            Conheça o projeto
          </Link>
        </p>
      </section>

      <section id="acervo" aria-labelledby="titulo-acervo" className="grid scroll-mt-4 gap-4">
        <h2 id="titulo-acervo" className="text-2xl font-bold">
          Acervo
        </h2>
        {hqs.length === 0 ? (
          <p className="text-muted">Ainda não há HQs publicadas. Volte em breve.</p>
        ) : (
          // Sem JavaScript (ou antes da hidratação) a grade completa é exibida.
          <Suspense fallback={<HqGrid hqs={hqs} />}>
            <Gallery hqs={hqs} />
          </Suspense>
        )}
      </section>
    </div>
  );
}
