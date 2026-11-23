import type { Metadata, Viewport } from "next";
import Link from "next/link";
import {
  ARTICLE_URL,
  getSiteUrl,
  isIndexable,
  LICENCA_GLOBAL,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";
import { INSTITUICAO } from "@/content/textos";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary", title: SITE_NAME, description: SITE_DESCRIPTION },
  robots: isIndexable() ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#101513" },
  ],
};

const NAV = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contribuir", label: "Contribuir" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#conteudo"
          className="bg-primary text-on-primary sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
        >
          Pular para o conteúdo
        </a>
        <header className="border-line bg-surface border-b">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2">
            <Link href="/" className="text-primary py-2 text-xl font-bold tracking-tight no-underline">
              Pro-Teacher <span className="text-fg">HQs</span>
            </Link>
            <nav aria-label="Principal">
              <ul className="flex flex-wrap items-center gap-x-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:bg-surface-2 inline-flex min-h-11 items-center rounded-lg px-3"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={REPO_URL}
                    className="hover:bg-surface-2 inline-flex min-h-11 items-center rounded-lg px-3"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main
          id="conteudo"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none"
        >
          {children}
        </main>

        <footer className="border-line bg-surface text-muted border-t text-sm">
          <div className="mx-auto grid max-w-6xl gap-2 px-4 py-6">
            <p>
              Projeto <strong className="text-fg">Pro-Teacher</strong> · {INSTITUICAO}
            </p>
            <p>
              {LICENCA_GLOBAL
                ? `Licença do acervo: ${LICENCA_GLOBAL}.`
                : "Licença do acervo: ainda não definida pelos autores."}{" "}
              Conteúdo criado com apoio de IA e revisado pelos professores-autores.
            </p>
            <p className="flex flex-wrap gap-x-4">
              <a className="prose-link" href={REPO_URL} rel="noopener noreferrer">
                Repositório no GitHub
              </a>
              {ARTICLE_URL && (
                <a className="prose-link" href={ARTICLE_URL} rel="noopener noreferrer">
                  Artigo (Latinoware 2026)
                </a>
              )}
              <Link className="prose-link" href="/contribuir">
                Como contribuir
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
