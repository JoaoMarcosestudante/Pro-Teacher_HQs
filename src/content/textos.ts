/**
 * Textos institucionais. Fontes autorizadas: README do repositório e o artigo
 * "Pro-Teacher: Changing History in the Classroom with Comics" (Latinoware 2026).
 * Não acrescentar dados que não estejam nessas fontes.
 */

export const CONCEITO = [
  "O Pro-Teacher é uma postura que coloca o professor no centro do processo e usa a inteligência artificial como aliada, não como substituta. A ideia é devolver tempo, criatividade e autonomia à prática docente.",
  "Professores da educação básica, especialmente na região amazônica, enfrentam uma carga de trabalho que vai muito além da sala de aula. Em vez de mais uma ferramenta complexa, o projeto oferece um caminho prático para produzir material didático de qualidade.",
  "A IA cuida da estruturação técnica. A autoria, as decisões pedagógicas e criativas e a revisão do material são sempre do professor.",
];

export const ETAPAS: { nome: string; descricao: string }[] = [
  { nome: "Intenção da HQ", descricao: "Tema, objetivo, público-alvo e mensagem principal" },
  { nome: "Tipo de conteúdo", descricao: "Explicativo, inspiracional ou narrativo, e o tom" },
  { nome: "Conceito central", descricao: "Explicação do conceito-chave em linguagem acessível" },
  {
    nome: "Especificações e estilo visual",
    descricao: "Título, paleta de cores, formato, balões e sinopse",
  },
  { nome: "Estrutura narrativa", descricao: "Resumo do enredo, página por página" },
  { nome: "Personagens", descricao: "Protagonista e coadjuvantes, com consistência visual" },
  { nome: "Cenários e atmosfera", descricao: "Ambientes, iluminação e cores" },
  {
    nome: "Roteiro técnico e prompts",
    descricao: "Roteiro painel a painel e prompts para gerar as imagens",
  },
];

export const FLUXO = ["Pré-teste", "Agente de IA — 8 etapas", "Canva", "Heyzine", "Pós-teste"];

export const RESULTADOS: [string, string][] = [
  ["Participantes", "16 professores do mestrado PROFCOMP"],
  ["Duração", "Cerca de 3 horas, presencial"],
  ["Conclusão da HQ", "100%"],
  ["Esforço mental percebido", "2,2 / 5"],
  ["Frustração", "1,5 / 5"],
  ["Facilidade de execução", "4,3 / 5"],
  ["Satisfação", "4,7 / 5"],
];

export const LIMITACOES = [
  "Amostra pequena e já familiarizada com IA.",
  "Não houve grupo de controle.",
  "As medidas são autorrelatadas.",
  "As HQs foram avaliadas qualitativamente pelos próprios autores do estudo.",
  "Os dados indicam intenção de uso, não uso efetivo em sala de aula.",
];

export const USO_DE_IA = [
  "As imagens e os textos das HQs foram gerados com apoio de IA e revisados pelos professores-autores, que assumem a responsabilidade pelo conteúdo.",
  "Os participantes foram orientados a não inserir dados pessoais (próprios ou de estudantes) nas interações. O conteúdo enviado à plataforma de IA se limitou a elementos fictícios das narrativas.",
  "O processamento das interações segue as políticas da plataforma de IA utilizada.",
];

export const CITACAO =
  "BORGES, Gustavo Silva; CARVALHO, João Marcos Freitas de; GUIMARÃES, Kassiane Costa; SOBRINHO, Maria Eliane; VIEIRA, Alex de Souza. Pro-Teacher: Changing History in the Classroom with Comics. Instituto de Geociências e Engenharias (IGE), Universidade Federal do Sul e Sudeste do Pará (Unifesspa), Marabá, PA, Brasil. Latinoware 2026.";

export const EQUIPE = [
  "Gustavo Silva Borges",
  "João Marcos Freitas de Carvalho",
  "Kassiane Costa Guimarães",
  "Maria Eliane Sobrinho",
  "Alex de Souza Vieira",
];

export const INSTITUICAO =
  "Instituto de Geociências e Engenharias (IGE), Universidade Federal do Sul e Sudeste do Pará (Unifesspa), Marabá, Pará.";

export const AVISO_IA =
  "Esta HQ foi criada com apoio de inteligência artificial e revisada por professores-autores.";

/** Exemplo exibido em /contribuir. Coberto por teste: precisa passar no schema. */
export const EXEMPLO_META = {
  titulo: "Título da sua HQ",
  subtitulo: "Frase curta que complementa o título (opcional)",
  sinopse: "Uma a três frases sobre a história, sem revelar dados pessoais.",
  temas: ["Educação ambiental", "Reciclagem"],
  areaConhecimento: "Ciências da Natureza",
  publicoAlvo: "Ensino Fundamental II",
  autores: ["Nome Sobrenome"],
  ano: 2026,
  idioma: "pt-BR",
  capa: "capa.webp",
  capaAlt: "Descrição objetiva do que aparece na capa.",
  pdf: "titulo-da-sua-hq.pdf",
  geradaComIA: true,
  publicada: true,
};
