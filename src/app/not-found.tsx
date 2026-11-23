import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid max-w-xl gap-4 py-10">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="text-muted text-lg">
        Não encontramos o que você procurava. A HQ pode ter mudado de endereço ou ainda não ter sido
        publicada.
      </p>
      <p>
        <Link href="/#acervo" className="btn-primary">
          Voltar ao acervo
        </Link>
      </p>
    </div>
  );
}
