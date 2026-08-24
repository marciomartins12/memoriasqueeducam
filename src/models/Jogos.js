const PALAVRAS_ORIGINAIS = [
  'SANTA RITA', 'SÃO FELIPE', 'QUILOMBOLA', 'MEMÓRIA', 'CULTURA',
  'TRADIÇÃO', 'ROÇA', 'LAVOURA', 'MANDIOCA', 'MACAXEIRA',
  'FARINHA', 'COCO', 'PESCA', 'MALHADEIRA', 'ESPINHEL',
  'TAMBOR', 'BUMBA-BOI', 'TAPUIA', 'IGREJA', 'FESTA',
  'NOVENA', 'REZA', 'FÉ', 'PLANTAS', 'CHÁ',
  'MASTRUZ', 'BOLDO', 'GENGIBRE', 'HORTELÃ', 'QUINA',
  'AROEIRA', 'SIRIGUELA', 'FAMÍLIA', 'ANCESTRAIS', 'COMUNIDADE',
  'JUVENTUDE', 'SABERES', 'TRABALHO', 'LAURENICE', 'FRANCISCA',
  'MARINALVA', 'PRESIDENTE SARNEY', 'RIO', 'CANOA', 'ANZOL',
  'PEIXE', 'SURUBIM', 'PIRANHA', 'MANDUBÉ', 'CARVÃO',
  'FOGÃO', 'FORNO', 'ROÇA', 'ARROZ', 'MILHO',
  'PLANTAÇÃO', 'COLHEITA', 'MATO', 'COQUEIRO', 'MANGUEIRA',
  'JAQUEIRA', 'LAMPARINA', 'ENERGIA', 'ESTRADA', 'CAMINHO',
  'CARROÇA', 'LADAINHA', 'PROMESSA', 'TERREIRO', 'RELIGIOSIDADE',
  'PRECONCEITO', 'RESPEITO', 'ANCESTRALIDADE', 'RESISTÊNCIA', 'ORALIDADE',
  'COLHEITA', 'PLANTIO', 'TAMBOR', 'DIVINO', 'LADAINHA'
];

const PALAVRAS_EXTRAS = [
  'CAXINGUELÊ', 'CAVALO MARINHO', 'FEIJOADA', 'CAZUZA', 'DENDÊ',
  'PIRÃO', 'FAROFA', 'QUIABO', 'CARURU', 'ACARAJÉ',
  'ABALÁ', 'ACARAJÉ', 'VATAPÁ', 'MOQUECA', 'XINXIM',
  'PINDÓI', 'UMBU', 'CAJÁ', 'GRAVIOLA', 'UMBURANA'
];

const TODAS_PALAVRAS = PALAVRAS_ORIGINAIS.concat(PALAVRAS_EXTRAS).slice(0, 100);

const NIVEIS_CACA_PALAVRAS = [];
for (let i = 0; i < 10; i++) {
  const nivel = {
    numero: i + 1,
    tempo_segundos: 300,
    palavras: TODAS_PALAVRAS.slice(i * 10, i * 10 + 10).map((p, idx) => ({
      id: (i * 10) + idx + 1,
      palavra: p,
      encontrada: false
    }))
  };
  NIVEIS_CACA_PALAVRAS.push(nivel);
}

const PERGUNTAS_VF_BRUTAS = [
  { id: 1,  pergunta: 'Francisca Nunes nasceu na comunidade de Santa Rita e viveu grande parte de sua vida ligada ao local.', gabarito: true },
  { id: 2,  pergunta: 'Quando Francisca era criança, Santa Rita já possuía muitas casas, estradas asfaltadas e caminhões fazendo o transporte das mercadorias.', gabarito: false },
  { id: 3,  pergunta: 'Antigamente, em Santa Rita, os carros de boi eram utilizados para transportar cargas até os armazéns.', gabarito: true },
  { id: 4,  pergunta: 'Marinalva de Jesus Nunes lembra que, quando era criança, Santa Rita tinha poucas casas e muitos caminhos de mato e de roça.', gabarito: true },
  { id: 5,  pergunta: 'Laurenice de Jesus Sá lembra que São Felipe antigamente possuía estradas asfaltadas e transporte fácil para outras localidades.', gabarito: false },
  { id: 6,  pergunta: 'Laurenice conta que, antigamente, os moradores de São Felipe precisavam enfrentar dificuldades para se deslocar, utilizando caminhos estreitos e de mato.', gabarito: true },
  { id: 7,  pergunta: 'Francisca aprendeu com seus pais a trabalhar na roça e a quebrar coco.', gabarito: true },
  { id: 8,  pergunta: 'Marinalva conta que, antigamente, as mulheres costumavam quebrar coco enquanto os homens trabalhavam na roça.', gabarito: true },
  { id: 9,  pergunta: 'Marinalva afirma que a quebra do coco continua sendo realizada atualmente pela maioria dos jovens da comunidade.', gabarito: false },
  { id: 10, pergunta: 'Francisca estudava pela manhã e, em muitos dias, ajudava nos trabalhos da roça durante a tarde.', gabarito: true },
  { id: 11, pergunta: 'A produção de arroz, mandioca e macaxeira fazia parte da alimentação e do modo de vida lembrado por Marinalva.', gabarito: true },
  { id: 12, pergunta: 'Laurenice também possui lembranças relacionadas ao trabalho na roça e afirma ter aprendido diferentes atividades do campo.', gabarito: true },
  { id: 13, pergunta: 'Francisca conta que a pesca é uma prática antiga de Santa Rita e que ainda continua sendo realizada.', gabarito: true },
  { id: 14, pergunta: 'Antigamente, os moradores de Santa Rita utilizavam apenas barcos a motor para pescar.', gabarito: false },
  { id: 15, pergunta: 'Segundo Francisca, antes das malhadeiras os moradores utilizavam principalmente anzol e espinhel.', gabarito: true },
  { id: 16, pergunta: 'Francisca afirma que os jovens da comunidade aprenderam a pescar com malhadeira e espinhel.', gabarito: true },
  { id: 17, pergunta: 'Francisca conta que os moradores de Santa Rita ainda produzem farinha utilizando mandioca.', gabarito: true },
  { id: 18, pergunta: 'Antigamente, a mandioca era colocada de molho diretamente no rio antes de ser preparada para a produção de farinha.', gabarito: true },
  { id: 19, pergunta: 'Francisca aprendeu com sua mãe e com os mais velhos conhecimentos sobre plantas medicinais e preparação de chás.', gabarito: true },
  { id: 20, pergunta: 'Marinalva aprendeu com sua mãe conhecimentos sobre plantas utilizadas tradicionalmente para preparar chás e outros remédios caseiros.', gabarito: true },
  { id: 21, pergunta: 'Entre as plantas mencionadas por Marinalva estão gengibre, boldo, mastruz, hortelã e quina.', gabarito: true },
  { id: 22, pergunta: 'Francisca menciona o mastruz como uma das plantas utilizadas tradicionalmente para preparar chá.', gabarito: true },
  { id: 23, pergunta: 'Francisca afirma que atualmente os jovens estão cada vez mais interessados em abandonar os conhecimentos sobre plantas medicinais.', gabarito: false },
  { id: 24, pergunta: 'Segundo Marinalva, é importante que os jovens conheçam as plantas e aprendam a cultivá-las para preservar esses conhecimentos.', gabarito: true },
  { id: 25, pergunta: 'Laurenice possui uma trajetória ligada às práticas religiosas e culturais de matriz africana.', gabarito: true },
  { id: 26, pergunta: 'Laurenice aprendeu práticas religiosas e conhecimentos tradicionais ao longo de sua vida e passou a transmiti-los para pessoas mais jovens.', gabarito: true },
  { id: 27, pergunta: 'Francisca participa dos festejos da igreja de Santa Rita e demonstra gostar das missas e novenas.', gabarito: true },
  { id: 28, pergunta: 'O tambor de crioula aparece nas lembranças e práticas culturais relatadas pelas três entrevistadas.', gabarito: true },
  { id: 29, pergunta: 'Marinalva afirma que o tambor de crioula é realizado durante os festejos da igreja de Santa Rita.', gabarito: true },
  { id: 30, pergunta: 'Marinalva lembra da brincadeira de bumba-boi e explica que as tapuias participavam como dançadeiras do boi.', gabarito: true },
  { id: 31, pergunta: 'A brincadeira de boi deixou de existir completamente em Santa Rita porque os moradores perderam todo o interesse pela tradição.', gabarito: false },
  { id: 32, pergunta: 'Francisca conta que gostava de brincar tambor, mas deixou de dançar depois que envelheceu.', gabarito: true },
  { id: 33, pergunta: 'Francisca lembra que algumas mangueiras de Santa Rita já existiam quando ela era criança e acredita que tenham mais de 100 anos.', gabarito: true },
  { id: 34, pergunta: 'Marinalva considera importante que os jovens conheçam a história da comunidade e valorizem os conhecimentos dos moradores mais antigos.', gabarito: true },
  { id: 35, pergunta: 'Francisca acredita que os jovens devem continuar estudando e aproveitando as oportunidades de educação.', gabarito: true },
  { id: 36, pergunta: 'Marinalva afirma que prefere morar em Santa Rita porque nasceu e cresceu na comunidade e possui forte vínculo com o lugar.', gabarito: true },
  { id: 37, pergunta: 'As três entrevistadas demonstram, em seus relatos, preocupação com a preservação dos conhecimentos e tradições transmitidos pelos mais velhos.', gabarito: true },
  { id: 38, pergunta: 'Marinalva acredita que registrar as histórias da comunidade pode ajudar os estudantes a conhecer melhor suas origens e tradições.', gabarito: true },
  { id: 39, pergunta: 'Para Marinalva, uma das coisas mais importantes para o futuro da comunidade é que os moradores se unam mais.', gabarito: true },
  { id: 40, pergunta: 'As histórias das três mulheres mostram que os saberes tradicionais eram transmitidos principalmente por livros e pela internet.', gabarito: false }
];

const PERGUNTAS_POR_NIVEL_VF = 1;
const NIVEIS_VERDADEIRO_FALSO = [];
for (let i = 0; i < Math.ceil(PERGUNTAS_VF_BRUTAS.length / PERGUNTAS_POR_NIVEL_VF); i++) {
  const questoes = PERGUNTAS_VF_BRUTAS
    .slice(i * PERGUNTAS_POR_NIVEL_VF, i * PERGUNTAS_POR_NIVEL_VF + PERGUNTAS_POR_NIVEL_VF)
    .map(function (q) { return Object.assign({}, q); });
  if (questoes.length === 0) continue;
  NIVEIS_VERDADEIRO_FALSO.push({
    numero: i + 1,
    tempo_segundos: 300,
    questoes: questoes
  });
}

const LISTA_JOGOS = [
  {
    slug: 'caca-palavras',
    numero: 1,
    nome: 'Caça-Palavras',
    icone: 'caca-palavras',
    descricao: 'Encontre as palavras escondidas no grid. 10 níveis, 10 palavras cada, 5 minutos por nível.',
    total_niveis: NIVEIS_CACA_PALAVRAS.length,
    ativo: true
  },
  {
    slug: 'verdadeiro-ou-falso',
    numero: 2,
    nome: 'Verdadeiro ou Falso',
    icone: 'verdadeiro-falso',
    descricao: 'Responda cada afirmação sobre as comunidades. ' + NIVEIS_VERDADEIRO_FALSO.length + ' níveis, 1 pergunta por nível, 5 minutos por nível.',
    total_niveis: NIVEIS_VERDADEIRO_FALSO.length,
    ativo: true
  }
];

function listarJogos() {
  return LISTA_JOGOS.map(j => ({ ...j }));
}

function getJogo(slug) {
  const jogo = LISTA_JOGOS.find(j => j.slug === slug);
  if (!jogo) return null;
  return { ...jogo };
}

function getNivelCacaPalavras(numeroNivel) {
  const n = NIVEIS_CACA_PALAVRAS.find(x => x.numero === numeroNivel);
  if (!n) return null;
  return {
    numero: n.numero,
    tempo_segundos: n.tempo_segundos,
    palavras: n.palavras.map(p => ({ id: p.id, palavra: p.palavra }))
  };
}

function getTotalNiveisCacaPalavras() {
  return NIVEIS_CACA_PALAVRAS.length;
}

function getNivelVerdadeiroFalso(numeroNivel) {
  const n = NIVEIS_VERDADEIRO_FALSO.find(x => x.numero === numeroNivel);
  if (!n) return null;
  return {
    numero: n.numero,
    tempo_segundos: n.tempo_segundos,
    questoes: n.questoes.map(q => ({
      id: q.id,
      pergunta: q.pergunta,
      gabarito: q.gabarito
    }))
  };
}

function getTotalNiveisVerdadeiroFalso() {
  return NIVEIS_VERDADEIRO_FALSO.length;
}

module.exports = {
  listarJogos,
  getJogo,
  getNivelCacaPalavras,
  getTotalNiveisCacaPalavras,
  getNivelVerdadeiroFalso,
  getTotalNiveisVerdadeiroFalso,
  NIVEIS_CACA_PALAVRAS,
  NIVEIS_VERDADEIRO_FALSO,
  LISTA_JOGOS
};
