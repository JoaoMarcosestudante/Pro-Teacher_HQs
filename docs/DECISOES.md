# Decisões técnicas

Registro das decisões tomadas na construção da plataforma e dos desvios da especificação
original (`PROMPT_PRO_TEACHER_HQS_APRIMORADO.md`). Data de referência: 23/11/2026.

## Acervo

### D1. Migração dos PDFs para `hqs/<slug>/`

- **Contexto:** a especificação supunha `hqs/<slug>/` existente, mas o repositório tinha 16 PDFs soltos na raiz,
  sem capas nem metadados, e proibia mover arquivos sem autorização.
- **Decisão:** com autorização do responsável, os PDFs foram movidos com `git mv`, o que preserva o histórico.
  Nenhum PDF foi modificado.
- **Duplicatas:** `HUNDRIANA.pdf` e `HQ - JOSIANE-BULLYING (2).pdf` eram idênticos byte a byte a outros arquivos
  (mesmo MD5) e foram removidos. Continuam disponíveis no histórico do Git.
- **Resultado:** 13 HQs, 12 publicadas.

### D2. Metadados extraídos das capas

- Os PDFs não têm camada de texto (páginas exportadas como imagem pelo Canva). Título, subtítulo e textos da capa
  foram **transcritos visualmente** da 1ª página. A autoria veio do nome do arquivo enviado, por isso aparece só o
  primeiro nome.
- Os **temas** foram inferidos do título e das frases da capa (ex.: "Diga não ao bullying!"). Eles precisam de
  confirmação dos autores.
- **`sinopse`, `areaConhecimento` e `publicoAlvo` foram deixados em branco**: escrever esses campos sem ler a HQ
  inteira seria inventar. Por isso o filtro por área fica oculto, já que só aparece com pelo menos 2 áreas.
- Três HQs não têm autoria conhecida: _A Saga do PROFCOMP 2026_ (arquivo sem nome), _O Professor Tradicional_ e
  _A Última Aula do Professor Severo_. "Severo" é o personagem, não o autor. O site mostra "Autoria a confirmar".
- O título real de _Missão Verde_ é **"A Viagem da Consciência"**, conforme a capa. O README e a especificação
  diziam "A Jornada…".
- A HQ de **Marinaldo** não traz título na capa nem na página 2 e ficou `publicada: false`.
- _Saga do PROFCOMP_ (Vienne) não tem capa: a imagem usada é a 1ª página da HQ, e o título vem do nome do arquivo.
- `ano: 2026` foi aplicado a todas as HQs (ano da oficina PROFCOMP 2026).

### D3. Capas geradas

- A 1ª página de cada PDF foi renderizada com pdfium (600 px de largura) e convertida para WebP com qualidade 78.
  Cada capa tem de 55 a 142 KB.
- As capas foram geradas fora do projeto, e nenhuma dependência de renderização foi adicionada ao repositório.

### D4. Seed da especificação não aplicado

O seed previa 3 HQs com `publicada: false` e campos `TODO`. Isso deixaria a galeria vazia e quebraria a validação,
porque os arquivos são obrigatórios. Duas das três HQs do artigo (Aruã e Missão Verde) já estavam no acervo
real, então o seed perdeu o sentido.

## Schema e validação

### D5. Regras alteradas em relação à especificação

| Campo        | Especificação                     | Implementado           | Motivo                                                            |
| ------------ | --------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| `publicada`  | opcional, padrão `true`           | **obrigatório**        | A ausência do campo não pode publicar uma HQ.                     |
| `sinopse`    | obrigatória se publicada          | opcional               | Não existe fonte para escrevê-la sem inventar (D2).               |
| `autores`    | obrigatório se publicada          | opcional               | 3 HQs sem autoria conhecida; o site mostra "Autoria a confirmar". |
| `ano`        | "faixa plausível"                 | 2025 até ano atual + 1 | Regra objetiva.                                                   |
| `capa`/`pdf` | arquivos exigidos até em rascunho | mantido                | Todas as HQs reais têm arquivos; não há rascunho sem arquivos.    |

- Marcadores de pendência (`TODO`, `TBD`, `A definir`, `A confirmar`) só são rejeitados **no início** de campos
  editoriais de HQ publicada. A palavra no meio de um texto legítimo continua aceita.
- `.strict()`: campos desconhecidos são erro. As mensagens seguem o formato
  `[hqs/<slug>/meta.json] campo "<campo>": <problema>`, com textos do Zod em português (`z.locales.pt`).

### D6. Schema único

O schema fica em `src/lib/schema.ts`, e a leitura do disco em `src/lib/content.ts`. Os scripts são `.ts`
executados com `tsx` e importam exatamente o mesmo código do site, então não existe cópia `.mjs`.

### D7. Limites de PDF

- **Aviso acima de 25 MB** (a especificação dizia 50 MB) e **erro acima de 95 MB**. Os PDFs atuais têm de 2 a
  22 MB, então um aviso a 50 MB nunca dispararia e não protegeria o público de conexões lentas.
- O limite de 95 MB é preventivo: o GitHub recusa arquivos acima de 100 MB. Ele não garante aceitação pela
  hospedagem.
- A validação verifica a assinatura do arquivo (`%PDF-`, `RIFF…WEBP`, PNG, JPEG) lendo só 12 bytes.

## Arquitetura

### D8. Versões

- **Next.js 16.4.6** (estável atual) em vez do 15 especificado: o 15 está defasado e não houve motivo para fixá-lo.
- **TypeScript 5.9.3**: o TS 7 (port nativo) ainda não é suportado pelo typescript-eslint (`<6.1`).
- **ESLint 9**: o eslint-plugin-react ainda não suporta o ESLint 10.
- `overrides.typescript-eslint = 8.73.0`: a 8.74.0 foi publicada no npm sem o `@typescript-eslint/parser`
  correspondente, o que quebra o `npm install`. Remova o override quando houver versão completa.
- Node 24 LTS no desenvolvimento (`.nvmrc`); `engines` pede `>=20.9`, o mínimo do Next 16.

### D9. Rastreamento de arquivos do servidor

Leituras de disco com caminho dinâmico fazem o Next incluir o projeto inteiro (cerca de 400 MB com `hqs/` e
`public/hqs/`) no pacote das funções do servidor. Como todas as rotas são estáticas, o acervo só é lido no build:

- as chamadas em `content.ts` usam `/*turbopackIgnore: true*/`;
- `outputFileTracingExcludes` exclui `hqs/**` e `public/hqs/**`.

Verificado: 0 arquivos do acervo nos `.nft.json` após o build.

### D10. Sincronização

Copia só as capas (ver D15). `public/hqs/` é inteiramente gerado (está no `.gitignore`) e nunca deve receber arquivos manuais. O script:

- remove pastas e arquivos que não pertencem ao conjunto publicado, sempre verificando que o caminho fica dentro
  de `public/hqs/`;
- recopia por tamanho + mtime (tolerância de 1 ms);
- roda no `predev` e no `prebuild` e cancela se a validação falhar.

## Interface

### D11. Simplificações deliberadas

- **Sem menu hambúrguer:** são só 4 links, que quebram linha no celular. Isso é mais acessível e dispensa JavaScript.
- **Sem botão de tema:** só `prefers-color-scheme` via CSS. Um botão persistente exigiria script inline no
  `<head>` para evitar o flash, o que conflita com a CSP.
- **Fontes do sistema** em vez de `next/font`: zero bytes de fonte e build sem depender de rede.
- **Grade com 2 colunas a partir de 360 px** (a especificação dizia 1 coluna em telas pequenas): com 12 capas,
  1 coluna obriga a rolar muito. Abaixo de 360 px fica 1 coluna.
- **Capas em proporção A4** (600×849) em vez de 3:4, para não cortar as capas.
- **Cards com `alt=""` na imagem:** o título dentro do link já nomeia o card (técnica WCAG H2). A descrição
  completa (`capaAlt`) aparece na página da HQ.
- **Sem embed de PDF:** navegadores móveis (Chrome Android, por exemplo) não exibem PDF em `<iframe>`. A página
  oferece "Baixar PDF" e "Ler o PDF no navegador" (nova aba).
- **Heyzine:** o componente carrega o iframe só quando o visitante pede e avisa que o serviço é externo. Nenhuma
  HQ tem `flipbookUrl` ainda, então **o embed real não foi testado**.
- **Filtros:** busca E área E (qualquer tema marcado). Só aparecem temas com resultado para a busca atual, e a URL
  usa `?q=&tema=a&tema=b&area=`. Os filtros usam `router.replace`: não poluem o histórico, e ao voltar de uma HQ
  a galeria reabre filtrada.
- **Sem JavaScript**, a galeria mostra a grade completa (fallback do `<Suspense>`).
- **Analytics não implementado:** fora do escopo útil atual e com impacto em privacidade.

### D12. CSP

`script-src` e `style-src` incluem `'unsafe-inline'`. O App Router injeta scripts inline (payload RSC) que mudam
a cada build. Nonces exigiriam renderização dinâmica (incompatível com SSG), e hashes não são viáveis. As demais
diretivas são restritivas (`object-src 'none'`, `frame-ancestors 'none'`, `frame-src` só para o Heyzine).
A CSP só vale em produção, porque o React Refresh usa `eval` em desenvolvimento.

### D13. Cache e URL canônica

- Capas e PDFs: `public, max-age=86400, stale-while-revalidate=604800`. Os nomes não são versionados, então uma
  substituição aparece em até 1 dia. Para atualização imediata, troque o nome do arquivo.
- URL canônica: `NEXT_PUBLIC_SITE_URL`; senão, `VERCEL_PROJECT_PRODUCTION_URL` (sempre o domínio de produção,
  mesmo em previews); senão, `localhost`. Previews recebem `noindex` e `robots: disallow`.

### D14. Imagens

`next/image` com tamanhos limitados (`deviceSizes: [384, 640]`, `imageSizes: [256]`), porque as capas têm
600 px. Isso limita as transformações na cota da Vercel.

### D15. PDFs servidos pelo GitHub, não pelo site

- **Contexto:** copiar os PDFs para `public/` deixava o deploy com cerca de 166 MB (98% PDFs). Isso passa do
  limite de "static file uploads" do plano Hobby da Vercel (100 MB) e consumiria a franquia de 100 GB/mês de
  tráfego (cerca de 7.300 downloads).
- **Decisão:** o site é uma interface para o repositório público. Só as **capas** (1,4 MB) entram no deploy. Os
  PDFs são lidos no build só para validar e medir o tamanho, e os links apontam para o GitHub:
  - **Baixar PDF:** `raw.githubusercontent.com/.../main/hqs/<slug>/<arquivo>.pdf`. Verificado: o GitHub serve como
    `application/octet-stream` com `nosniff`, então o navegador baixa o arquivo;
  - **Ler no GitHub:** página `blob`, com o visualizador do GitHub. O comportamento no celular não foi verificado
    (o GitHub recusa acesso automatizado a essa página).
- **Desvio da especificação:** o download não é no mesmo domínio, e o atributo `download` não se aplica.
- **Consequências:**
  - os links só funcionam depois que os arquivos estiverem na branch `main` (`REPO_BRANCH` em `src/lib/site.ts`);
  - o GitHub não é uma CDN: para tráfego alto, avaliar Releases ou um armazenamento dedicado;
  - o `raw` tem cache de 5 minutos.

## Pendências

- [ ] **Licença** do acervo (`LICENCA_GLOBAL` em `src/lib/site.ts`) com o aceite dos autores.
- [ ] **Confirmação pelos autores** de temas, nomes completos e autoria das 3 HQs sem autor.
- [ ] Título da HQ de Marinaldo.
- [ ] Sinopses, área do conhecimento e público-alvo (opcionais; melhoram busca e filtros).
- [ ] URLs do Heyzine (`flipbookUrl`) e teste do embed real em produção.
- [ ] Domínio de produção e `NEXT_PUBLIC_SITE_URL`; substituir `[URL A SER CONFIGURADA]` no README.
- [ ] URL pública do artigo (`ARTICLE_URL`).
- [x] ~~Tamanho do deploy~~: resolvido por D15 (deploy com cerca de 3 MB).
- [ ] **Versões leves dos PDFs** (cerca de 3 MB por página hoje): recomprimir imagens para uso em dados móveis,
      mantendo os originais.
- [ ] Testes de ponta a ponta (Playwright), medição Lighthouse e inspeção com leitor de tela: não executados
      neste ambiente, por falta de navegador headless.
