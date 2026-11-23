import type { NextConfig } from "next";
import { FLIPBOOK_HOSTS } from "./src/lib/schema";

/*
 * CSP compatível com geração estática (SSG).
 * O App Router injeta scripts inline (payload RSC) que mudam a cada build; nonces exigiriam
 * renderização dinâmica. Por isso script-src mantém 'unsafe-inline' — concessão documentada
 * em docs/DECISOES.md. As demais diretivas são restritivas.
 * Em desenvolvimento a CSP não é aplicada (o React Refresh usa eval).
 */
const frameSrc = FLIPBOOK_HOSTS.flatMap((h) => [`https://${h}`, `https://*.${h}`]).join(" ");

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  `frame-src ${frameSrc}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // O acervo é lido apenas no build; nunca empacotar PDFs/capas nas funções do servidor.
  outputFileTracingExcludes: { "*": ["hqs/**", "public/hqs/**"] },
  // Capas têm 600 px de largura: variantes maiores seriam desperdício de transformações.
  images: { deviceSizes: [384, 640], imageSizes: [256], qualities: [75] },
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Capas e PDFs: nomes não são versionados, então o cache é moderado
        // (1 dia + revalidação em segundo plano) em vez de "immutable".
        source: "/hqs/:slug/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
