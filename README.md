# 📚 Pro-Teacher: Mudando a História em Sala de Aula com Quadrinhos

Repositório aberto com as **histórias em quadrinhos (HQs) pedagógicas** produzidas na oficina **Pro-Teacher**, desenvolvida na Universidade Federal do Sul e Sudeste do Pará (**Unifesspa**), em Marabá (PA).

As HQs foram criadas por professores, com o apoio de um agente conversacional de IA que atuou como tutor. Aqui elas ficam disponíveis para leitura, uso em sala de aula e inspiração para outros educadores.

---

## 💡 O que é o Pro-Teacher?

**Pro-Teacher** é uma postura que coloca o professor no centro do processo e usa a Inteligência Artificial como **aliada, não como substituta**. A ideia é devolver tempo, criatividade e autonomia à prática docente.

Professores da educação básica, especialmente na região amazônica, enfrentam uma carga de trabalho que vai muito além da sala de aula. Para eles, aprender e aplicar novas tecnologias costuma ser mais uma tarefa. O projeto parte de outra pergunta: em vez de mais uma ferramenta complexa, como oferecer um caminho prático para produzir material didático de qualidade?

A criação de HQs pedagógicas é uma expressão concreta desse conceito, mas o Pro-Teacher não se limita a ela.

## 🎨 O que são essas HQs?

São quadrinhos **autorais**, criados por professores a partir de temas do seu cotidiano e com **intenção pedagógica clara**: cada HQ tem mensagem, público-alvo e conflito definidos, indo além do entretenimento visual.

Os quadrinhos reúnem texto, imagem e narrativa. Por isso são uma linguagem multimodal que engaja, facilita a compreensão de conceitos de forma lúdica e contextualizada, e pode ser usada em diferentes áreas do conhecimento.

Os temas abordados na oficina incluem:

- Educação ambiental e reciclagem
- Valorização da cultura indígena
- Prevenção ao *bullying* escolar
- Protagonismo estudantil
- Formação docente
- Cidadania

## 🤖 Como as HQs foram feitas

Um agente customizado, criado no ChatGPT, guiou cada professor por **8 etapas objetivas**, da intenção pedagógica até o roteiro técnico:

| # | Etapa | O que o professor define |
|---|-------|--------------------------|
| 1 | Intenção da HQ | Tema, objetivo, público-alvo e mensagem principal |
| 2 | Tipo de conteúdo | Explicativo, inspiracional ou narrativo, e o tom |
| 3 | Conceito central | Explicação do conceito-chave em linguagem acessível |
| 4 | Especificações e estilo visual | Título, paleta de cores, formato, balões e sinopse |
| 5 | Estrutura narrativa | Resumo do enredo, página por página |
| 6 | Personagens | Protagonista e coadjuvantes, com consistência visual |
| 7 | Cenários e atmosfera | Ambientes, iluminação e cores |
| 8 | Roteiro técnico e prompts | Roteiro painel a painel e prompts para gerar as imagens |

Depois das 8 etapas, cada professor fez o acabamento no **Canva** (diagramação, balões e onomatopeias) e publicou o resultado como **flipbook** interativo no **Heyzine**.

**O agente cuida da estruturação técnica. As decisões pedagógicas e criativas são sempre do professor.**

## 📖 HQs disponíveis

| HQ | Autoria | Temas | Arquivos |
|----|---------|-------|----------|
| *Aruã e a Linguagem dos Símbolos* | Romário | Cultura indígena, saberes tradicionais, tecnologia | [pasta](hqs/arua-e-a-linguagem-dos-simbolos/) |
| *Missão Verde: A Viagem da Consciência* | Ernandes | Educação ambiental, reciclagem, preservação | [pasta](hqs/missao-verde-a-viagem-da-consciencia/) |
| *O Futuro Começa Agora!* | Nailson | Educação ambiental, sustentabilidade, reciclagem | [pasta](hqs/o-futuro-comeca-agora/) |
| *João Merece Respeito* | Hundriana | Bullying, respeito, empatia, inclusão, amizade | [pasta](hqs/joao-merece-respeito/) |
| *Palavras Machucam* | Josiane | Bullying, respeito, empatia | [pasta](hqs/palavras-machucam/) |
| *Quem Vê Também Pode Ajudar* | Gustavo Borges | Bullying, respeito, empatia, coragem | [pasta](hqs/quem-ve-tambem-pode-ajudar/) |
| *Respeito no Recreio* | David Cleiton | Bullying, respeito, amizade | [pasta](hqs/respeito-no-recreio/) |
| *A Última Aula do Professor Severo* | a confirmar | Práticas pedagógicas, diversidade, metodologias ativas | [pasta](hqs/a-ultima-aula-do-professor-severo/) |
| *O Professor Tradicional* | a confirmar | Formação docente, práticas pedagógicas | [pasta](hqs/o-professor-tradicional/) |
| *A Saga do PROFCOMP 2026* | a confirmar | Formação docente, tecnologias digitais | [pasta](hqs/a-saga-do-profcomp-2026/) |
| *A Saga do PROFCOMP 2026* | Waldo | Formação docente, tecnologias digitais, Amazônia | [pasta](hqs/a-saga-do-profcomp-2026-waldo/) |
| *Saga do PROFCOMP* | Vienne | Formação docente, tecnologias digitais | [pasta](hqs/saga-do-profcomp-vienne/) |

Há ainda uma HQ de Marinaldo aguardando a confirmação do título (`hqs/hq-marinaldo/`, não publicada). Títulos e autoria foram transcritos das capas e dos nomes dos arquivos enviados; os temas foram inferidos das capas e devem ser confirmados pelos autores.

## 🗂️ Estrutura do repositório

```
.
├── README.md
├── CONTRIBUTING.md        # como adicionar uma HQ
├── hqs/                   # acervo: fonte da verdade do site
│   └── <slug>/
│       ├── meta.json      # título, temas, autoria, publicação...
│       ├── capa.webp
│       └── <slug>.pdf
├── src/                   # plataforma web (Next.js)
├── scripts/               # validação do acervo e cópia dos arquivos para o site
├── tests/
└── docs/DECISOES.md       # decisões técnicas e pendências
```

## 🚀 Como usar

- **Ler:** acesse o PDF ou o flipbook de cada HQ pelos links da tabela acima.
- **Usar em sala de aula:** baixe e compartilhe com seus alunos. Vale ler a HQ antes e adaptar a atividade à sua turma.
- **Contribuir:** se você produziu uma HQ com essa metodologia e quer incluí-la aqui, abra uma *issue* ou um *pull request*.

## 📊 Resultados da oficina

A oficina foi realizada presencialmente, com **16 professores** do mestrado profissional PROFCOMP, em cerca de 3 horas.

- **100%** dos participantes concluíram sua HQ.
- A maioria tinha pouca ou nenhuma experiência prévia em produzir quadrinhos.
- Esforço mental percebido: **2,2 / 5** (baixo).
- Frustração: **1,5 / 5** (baixa).
- Facilidade de execução: **4,3 / 5** (alta).
- Satisfação: **4,7 / 5** (alta).

Esses resultados indicam uma boa receptividade, mas devem ser lidos com cautela. A amostra é pequena e já familiarizada com IA, não houve grupo de controle e as medidas são autorrelatadas. Os detalhes e as limitações estão no artigo.

## ⚠️ Sobre o uso de IA

- As imagens e os textos das HQs foram gerados com apoio de IA e **revisados pelos professores-autores**, que assumem a responsabilidade pelo conteúdo.
- Os participantes foram orientados a **não inserir dados pessoais** (próprios ou de estudantes) nas interações. O conteúdo enviado à plataforma se limitou a elementos fictícios das narrativas.
- O processamento das interações segue as políticas da plataforma de IA utilizada.

## 🔭 Próximos passos

- Aplicar a oficina em escolas com infraestrutura tecnológica mais limitada.
- Fazer um acompanhamento (*follow-up*) após um semestre, para verificar se a metodologia foi incorporada à prática docente.
- Disponibilizar o link do agente e um tutorial passo a passo, para que outros professores criem suas próprias HQs com autonomia.

## 📄 Artigo e como citar

Este repositório acompanha o artigo apresentado na **Latinoware 2026**:

> BORGES, Gustavo Silva; CARVALHO, João Marcos Freitas de; GUIMARÃES, Kassiane Costa; SOBRINHO, Maria Eliane; VIEIRA, Alex de Souza. **Pro-Teacher: Changing History in the Classroom with Comics.** Instituto de Geociências e Engenharias (IGE), Universidade Federal do Sul e Sudeste do Pará (Unifesspa), Marabá, PA, Brasil. Latinoware 2026.

## 👥 Equipe

Instituto de Geociências e Engenharias (IGE), **Unifesspa**, Marabá, Pará.

- Gustavo Silva Borges
- João Marcos Freitas de Carvalho
- Kassiane Costa Guimarães
- Maria Eliane Sobrinho
- Alex de Souza Vieira

## 📬 Contato

Dúvidas, sugestões ou interesse em colaborar? Abra uma *issue* neste repositório.

## ⚖️ Licença

A licença do acervo ainda não foi definida pelos autores. Até essa definição, consulte os autores antes de reutilizar o material fora de sala de aula.

## 🌐 Plataforma web

Acesse a plataforma: [URL A SER CONFIGURADA]

### Executar localmente

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

### Adicionar uma HQ

Crie uma pasta em `hqs/<slug>/` com `meta.json`, capa e PDF. Consulte `CONTRIBUTING.md` para os requisitos e execute `npm run validate` antes de abrir um pull request.
