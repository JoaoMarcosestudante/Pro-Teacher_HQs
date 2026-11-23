"use client";

import { useState } from "react";

function useAviso() {
  const [aviso, setAviso] = useState("");
  const mostrar = (texto: string) => {
    setAviso(texto);
    window.setTimeout(() => setAviso(""), 4000);
  };
  return [aviso, mostrar] as const;
}

async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [aviso, mostrar] = useAviso();
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="btn-secondary"
        onClick={async () => mostrar((await copiar(text)) ? "Copiado!" : "Não foi possível copiar.")}
      >
        {label}
      </button>
      <span role="status" className="text-muted text-sm">
        {aviso}
      </span>
    </span>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [aviso, mostrar] = useAviso();
  async function compartilhar() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return; // cancelado pelo usuário
      }
    }
    mostrar((await copiar(url)) ? "Link copiado!" : "Copie o endereço na barra do navegador.");
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" className="btn-secondary" onClick={compartilhar}>
        Compartilhar
      </button>
      <span role="status" className="text-muted text-sm">
        {aviso}
      </span>
    </span>
  );
}

/** Carrega o flipbook externo somente quando o visitante pede (economiza dados e evita terceiros). */
export function FlipbookReader({ url, title }: { url: string; title: string }) {
  const [aberto, setAberto] = useState(false);
  if (!aberto) {
    return (
      <div className="border-line bg-surface-2 grid gap-3 rounded-xl border p-4">
        <p>
          A leitura interativa usa o serviço externo <strong>Heyzine</strong>, que só é carregado se você
          pedir.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={() => setAberto(true)}>
            Abrir leitor interativo
          </button>
          <a className="btn-secondary" href={url} target="_blank" rel="noopener noreferrer">
            Abrir no Heyzine (nova aba)
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-2">
      <div className="border-line aspect-[3/4] w-full overflow-hidden rounded-xl border sm:aspect-[4/3]">
        <iframe
          src={url}
          title={`Leitor interativo: ${title}`}
          className="h-full w-full"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="text-muted text-sm">
        Se o leitor não carregar,{" "}
        <a className="prose-link" href={url} target="_blank" rel="noopener noreferrer">
          abra-o em uma nova aba
        </a>{" "}
        ou baixe o PDF.
      </p>
    </div>
  );
}
