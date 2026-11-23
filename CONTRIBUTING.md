# Como contribuir com uma HQ

Este repositório guarda as HQs pedagógicas do projeto Pro-Teacher e também é a fonte do site. Cada pasta em
`hqs/` vira uma página no site, sem mudar nenhuma linha de código.

## 1. Estrutura

```
hqs/
  <slug>/
    meta.json
    capa.webp
    <slug>.pdf
```

**Slug** é o nome da pasta e o endereço da HQ (`/hqs/<slug>`):

- letras minúsculas, números e hífens: `missao-verde-a-viagem-da-consciencia`;
- sem acentos, espaços, hífen no início/fim ou hífens repetidos;
- se o título já existir no acervo, acrescente o nome do autor: `a-saga-do-profcomp-2026-waldo`.

## 2. Arquivos

| Arquivo | Requisitos                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| Capa    | `.webp` (preferido), `.jpg`, `.jpeg` ou `.png`, com cerca de 600 px de largura e de preferência até 150 KB |
| PDF     | Recomendado até 25 MB; **o limite é 95 MB**. Arquivos menores carregam melhor em celulares                 |
| Nomes   | Só letras sem acento, números, `.`, `-` e `_`; sem espaços                                                 |

Links simbólicos não são aceitos, e o conteúdo precisa corresponder à extensão: um `.pdf` precisa ser um PDF de
verdade.

## 3. `meta.json`

```json
{
  "titulo": "Título da sua HQ",
  "subtitulo": "Frase curta que complementa o título (opcional)",
  "sinopse": "Uma a três frases sobre a história, sem revelar dados pessoais.",
  "temas": ["Educação ambiental", "Reciclagem"],
  "areaConhecimento": "Ciências da Natureza",
  "publicoAlvo": "Ensino Fundamental II",
  "autores": ["Nome Sobrenome"],
  "ano": 2026,
  "idioma": "pt-BR",
  "capa": "capa.webp",
  "capaAlt": "Descrição objetiva do que aparece na capa.",
  "pdf": "titulo-da-sua-hq.pdf",
  "flipbookUrl": "https://heyzine.com/flip-book/xxxxxxxx.html",
  "geradaComIA": true,
  "licenca": "CC BY-NC-SA 4.0",
  "publicada": true
}
```

| Campo                             | Obrigatório | Regra                                                               |
| --------------------------------- | ----------- | ------------------------------------------------------------------- |
| `titulo`                          | sim         | Até 120 caracteres                                                  |
| `temas`                           | sim         | De 1 a 5, sem repetição                                             |
| `ano`                             | sim         | De 2025 até o próximo ano                                           |
| `capa`, `pdf`                     | sim         | Nomes dos arquivos dentro da pasta                                  |
| `capaAlt`                         | sim         | Descrição da capa para leitores de tela                             |
| `publicada`                       | sim         | `true` aparece no site; `false` fica como rascunho                  |
| `subtitulo`, `sinopse`            | não         | Sinopse com até 400 caracteres                                      |
| `autores`                         | não         | Recomendado. Sem ele, o site mostra "Autoria a confirmar"           |
| `areaConhecimento`, `publicoAlvo` | não         | Ativam filtro e informações na página                               |
| `idioma`                          | não         | Padrão `pt-BR`                                                      |
| `flipbookUrl`                     | não         | Só `https://` em `heyzine.com` ou subdomínios                       |
| `geradaComIA`                     | não         | Padrão `true`, pois é a regra do projeto. Mostra um aviso na página |
| `licenca`                         | não         | Se ausente, vale a licença global do acervo (ainda não definida)    |

Campos fora desta lista causam erro.

### Rascunhos e `TODO`

Uma HQ com `"publicada": false` é validada, mas não aparece no site (nem no sitemap, nem os arquivos dela).
Somente nesse caso são aceitos textos que **começam** com `TODO`, `TBD`, `A definir` ou `A confirmar`. Em HQ
publicada, eles são rejeitados.

## 4. Validar e enviar

```bash
npm install
npm run validate   # confere todos os meta.json e arquivos
npm run dev        # opcional: veja a HQ em http://localhost:3000
```

Depois abra um **pull request** e preencha o checklist. Se não tiver familiaridade com Git, abra uma **issue** com
os arquivos e a equipe faz a inclusão.

## 5. Regras

- **Não inclua dados pessoais de estudantes**: nomes reais, fotos ou informações que identifiquem alunos, na HQ
  e nos metadados.
- Publique só com autorização de todos os autores.
- O conteúdo gerado com IA precisa ter sido revisado pelo professor-autor.
- Nunca coloque arquivos em `public/hqs/`: essa pasta é gerada automaticamente a partir de `hqs/`.

## Desenvolvimento

```bash
npm run lint && npm run typecheck && npm test && npm run validate && npm run build
```

As decisões técnicas estão em [`docs/DECISOES.md`](docs/DECISOES.md).
