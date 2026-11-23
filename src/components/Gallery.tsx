"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { contarValores, filtrar, normalizar, type HqResumo } from "@/lib/hqs";
import { HqGrid } from "./HqGrid";

/**
 * Galeria com busca e filtros. A URL é a fonte da verdade (?q=&tema=&tema=&area=);
 * só o texto digitado tem estado local, para a digitação não depender da navegação.
 * router.replace: filtrar não cria entradas no histórico, e ao voltar de uma HQ
 * a galeria reabre com os mesmos filtros.
 */
export function Gallery({ hqs }: { hqs: HqResumo[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const todosTemas = useMemo(() => contarValores(hqs.flatMap((h) => h.temas)), [hqs]);
  const todasAreas = useMemo(() => contarValores(hqs.map((h) => h.areaConhecimento)), [hqs]);

  // Somente valores existentes no acervo são aceitos vindos da URL.
  const temasValidos = new Map(todosTemas.map((t) => [normalizar(t.valor), t.valor]));
  const temasSel = [...new Set(params.getAll("tema").flatMap((t) => temasValidos.get(normalizar(t)) ?? []))];
  const areaParam = params.get("area") ?? "";
  const area = todasAreas.find((a) => normalizar(a.valor) === normalizar(areaParam))?.valor ?? "";
  const urlQ = params.get("q") ?? "";

  // Sincroniza o campo com a URL (voltar/avançar) sem efeito colateral.
  const [q, setQ] = useState(urlQ);
  const [ultimoUrlQ, setUltimoUrlQ] = useState(urlQ);
  if (urlQ !== ultimoUrlQ) {
    setUltimoUrlQ(urlQ);
    setQ(urlQ);
  }

  function aplicar(next: { q?: string; temas?: string[]; area?: string }) {
    const p = new URLSearchParams();
    const nq = (next.q ?? q).trim();
    if (nq) p.set("q", nq);
    for (const t of next.temas ?? temasSel) p.append("tema", t);
    const na = next.area ?? area;
    if (na) p.set("area", na);
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }

  const resultado = filtrar(hqs, { q, temas: temasSel, area });
  // Temas oferecidos: os que têm resultado para a busca/área atuais, mais os já marcados.
  const temasDisponiveis = contarValores(filtrar(hqs, { q, area }).flatMap((h) => h.temas));
  const temasVisiveis = todosTemas.filter(
    (t) => temasSel.includes(t.valor) || temasDisponiveis.some((d) => d.valor === t.valor),
  );
  const algumFiltro = Boolean(q.trim() || temasSel.length || area);

  return (
    <div className="grid gap-6">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-4">
        <div className="grid gap-1">
          <label htmlFor="busca" className="font-semibold">
            Buscar HQs
          </label>
          <input
            id="busca"
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              aplicar({ q: e.target.value });
            }}
            placeholder="Título, autor ou tema"
            autoComplete="off"
            className="border-line-strong bg-surface min-h-11 w-full max-w-xl rounded-lg border px-3"
          />
        </div>

        {todasAreas.length > 1 && (
          <div className="grid gap-1">
            <label htmlFor="area" className="font-semibold">
              Área do conhecimento
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => aplicar({ area: e.target.value })}
              className="border-line-strong bg-surface min-h-11 w-full max-w-xs rounded-lg border px-3"
            >
              <option value="">Todas</option>
              {todasAreas.map((a) => (
                <option key={a.valor} value={a.valor}>
                  {a.valor}
                </option>
              ))}
            </select>
          </div>
        )}

        <fieldset>
          <legend className="mb-2 font-semibold">Temas</legend>
          <div className="flex flex-wrap gap-2">
            {temasVisiveis.map((t) => {
              const ativo = temasSel.includes(t.valor);
              return (
                <button
                  key={t.valor}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() =>
                    aplicar({ temas: ativo ? temasSel.filter((x) => x !== t.valor) : [...temasSel, t.valor] })
                  }
                  className={`min-h-11 rounded-full border px-3 text-sm ${
                    ativo
                      ? "border-primary bg-primary text-on-primary"
                      : "border-line-strong bg-surface hover:bg-surface-2"
                  }`}
                >
                  {ativo && <span aria-hidden="true">✓ </span>}
                  {t.valor}
                </button>
              );
            })}
          </div>
        </fieldset>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-muted">
          {resultado.length === hqs.length
            ? `${hqs.length} HQs no acervo`
            : `${resultado.length} de ${hqs.length} HQs encontradas`}
        </p>
        {algumFiltro && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setQ("");
              aplicar({ q: "", temas: [], area: "" });
            }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {resultado.length > 0 ? (
        <HqGrid hqs={resultado} />
      ) : (
        <div className="border-line rounded-xl border border-dashed p-8 text-center">
          <p className="font-semibold">Nenhuma HQ encontrada com esses filtros.</p>
          <p className="text-muted">Tente outra palavra ou limpe os filtros para ver todo o acervo.</p>
        </div>
      )}
    </div>
  );
}
