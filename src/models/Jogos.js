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
    tempo_segundos: 20,
    questoes: questoes
  });
}

const PERGUNTAS_QUIZ_BRUTAS = [
  {
    id: 1,
    pergunta: "Quando Dona Laura mudou-se para a comunidade de São Felipe há aproximadamente 38 anos, como era a infraestrutura de acesso ao local?",
    alternativas: {
      A: "Havia estradas asfaltadas que ligavam São Felipe diretamente aos municípios vizinhos.",
      B: "O acesso era feito exclusivamente por embarcações devido aos rios que cercavam o povoado.",
      C: "Havia poucas estradas e os moradores precisavam abrir caminhos estreitos usando enxadas.",
      D: "A comunidade contava com transporte público diário em estradas de terra batida."
    },
    gabarito: "C"
  },
  {
    id: 2,
    pergunta: "Aos nove anos de idade, Dona Laura realizou seu primeiro preparo medicinal tradicional com auxílio de uma orientação espiritual. Qual foi o ingrediente principal utilizado nessa receita?",
    alternativas: {
      A: "Arruda",
      B: "Aroeira",
      C: "Erva-cidreira",
      D: "Malva-branca"
    },
    gabarito: "D"
  },
  {
    id: 3,
    pergunta: "Durante a infância, Dona Laura enfrentou graves problemas de saúde, perdendo temporariamente a visão e a mobilidade. Qual promessa religiosa motivou a realização de uma festa comunitária quando ela completou 22 anos?",
    alternativas: {
      A: "Uma promessa feita por seu avô ao Rei Sebastião para realizar uma festa para São Benedito.",
      B: "Um voto feito por sua mãe para construir uma igreja de taipa.",
      C: "Um compromisso feito por Dona Laura com a comunidade para organizar o carimbó.",
      D: "Uma promessa de realizar uma ladainha anual em homenagem a São João."
    },
    gabarito: "A"
  },
  {
    id: 4,
    pergunta: "Com mais de três décadas de existência, o que o terreiro de Dona Laura representa em sua vida, além das práticas religiosas?",
    alternativas: {
      A: "Apenas um local de trabalho agrícola e armazenamento de grãos.",
      B: "Um espaço de memória, união, diálogo, respeito e ensinamento para a comunidade.",
      C: "Um centro de ensino formal onde ela concluiu seus estudos primários.",
      D: "Um local reservado exclusivamente para celebrações durante o período do carnaval."
    },
    gabarito: "B"
  },
  {
    id: 5,
    pergunta: "Qual prática cultural tradicional Dona Laura faz questão de ensinar às meninas e jovens da comunidade, por considerar que esse acesso nem sempre era permitido às mulheres no passado?",
    alternativas: {
      A: "A farra de caixa",
      B: "A dança do tambor",
      C: "O desfile do 7 de setembro",
      D: "A confecção de lamparinas"
    },
    gabarito: "B"
  },
  {
    id: 6,
    pergunta: "Preocupada com o esquecimento de pratos tradicionais pelas novas gerações, Dona Laura realizou um festival de matriz africana destacando quais alimentos?",
    alternativas: {
      A: "Muqueca e arroz de milho",
      B: "Feijoada e vatapá",
      C: "Caruru e maniçoba",
      D: "Tapioca e arroz de caxambu"
    },
    gabarito: "A"
  },
  {
    id: 7,
    pergunta: "Além de seu trabalho religioso e medicinal, qual atividade ligada à zona rural Dona Laura aprendeu e exerceu desde a juventude?",
    alternativas: {
      A: "Construção de embarcações de madeira",
      B: "Trabalho na roça e cercamento de terrenos",
      C: "Produção industrial de cerâmica",
      D: "Tecelagem artesanal de algodão"
    },
    gabarito: "B"
  },
  {
    id: 8,
    pergunta: "Como Dona Laura costuma reagir ao enfrentar episódios de preconceito e discriminação em relação às suas práticas religiosas de matriz africana?",
    alternativas: {
      A: "Decidindo fechar temporariamente o salão até que as críticas diminuam.",
      B: "Organizando-se ainda mais e fortalecendo o seu trabalho e compromisso.",
      C: "Evitando realizar festejos públicos e mantendo os rituais estritamente privados.",
      D: "Mudando-se temporariamente para Curralzinho até a situação se acalmar."
    },
    gabarito: "B"
  },
  {
    id: 9,
    pergunta: "Por que Dona Laura considera importante o registro de sua história e das memórias de São Felipe em um sistema web?",
    alternativas: {
      A: "Para garantir a venda de remédios tradicionais pela internet.",
      B: "Para preservar a memória da comunidade e combater o preconceito por meio do conhecimento.",
      C: "Para solicitar a construção de novas estradas ao poder público.",
      D: "Para substituir a transmissão oral de ensinamentos dentro de seu terreiro."
    },
    gabarito: "B"
  },
  {
    id: 10,
    pergunta: "Como a moradora Maria Benedita descreve a paisagem e o modo de vida em São Felipe durante a sua infância?",
    alternativas: {
      A: "Uma cidade com bairros estruturados, comércios variados e ruas pavimentadas.",
      B: "Uma comunidade com poucas casas distantes entre si, cercadas por grandes áreas de mato.",
      C: "Um povoado urbano com iluminação pública e transporte coletivo frequente.",
      D: "Uma região exclusivamente dedicada ao turismo e à pesca artesanal."
    },
    gabarito: "B"
  },
  {
    id: 11,
    pergunta: "Quais práticas coletivas promovidas pelos moradores de São Felipe no passado ajudavam a fortalecer a solidariedade e os vínculos comunitários?",
    alternativas: {
      A: "A contratação de maquinário agrícola e reuniões sindicais fechadas.",
      B: "O comércio de insumos agrícolas e reuniões em escritórios locais.",
      C: "Os mutirões na roça (como capinar e cortar arroz) e a partilha da carne de porco com os vizinhos.",
      D: "A construção individual de cercas e o cultivo isolado de hortas familiares."
    },
    gabarito: "C"
  },
  {
    id: 12,
    pergunta: "Na visão de Maria Benedita, quais fatores recentes contribuíram para o distanciamento entre as pessoas e a redução das visitas entre vizinhos na comunidade?",
    alternativas: {
      A: "O aumento das opções de lazer público e a falta de tempo.",
      B: "O uso constante do celular e o aumento da sensação de insegurança.",
      C: "O fechamento das igrejas locais e a ausência de transporte.",
      D: "O excesso de eventos culturais diários e o trabalho noturno."
    },
    gabarito: "B"
  },
  {
    id: 13,
    pergunta: "Devido às limitações no acesso à escola formal na época, quais conhecimentos práticos do campo eram essenciais na formação das crianças em São Felipe?",
    alternativas: {
      A: "Mecânica de tratores e operação de usinas.",
      B: "Técnicas de irrigação industrial e navegação fluvial.",
      C: "Cultivo e manejo do arroz, capina e criação de animais como porcos e galinhas.",
      D: "Produção de ferramentas metálicas e marcenaria pesada."
    },
    gabarito: "C"
  },
  {
    id: 14,
    pergunta: "Para explicar a necessidade da participação dos jovens na preservação da cultura de São Felipe, qual metáfora Maria Benedita utiliza em seu relato?",
    alternativas: {
      A: "Compara a cultura a um rio que precisa de chuva constante para não secar.",
      B: "Compara a cultura a uma casa de taipa que precisa de reparos contínuos.",
      C: "Compara a cultura a uma árvore que precisa criar raízes e brotos para continuar crescendo.",
      D: "Compara a cultura a uma estrada que precisa ser pavimentada pelos mais novos."
    },
    gabarito: "C"
  },
  {
    id: 15,
    pergunta: "Qual é a relação de Valderez da Cruz Rodrigues com o território e com os moradores de São Felipe?",
    alternativas: {
      A: "Ele mudou-se recentemente para a comunidade vindo de outra cidade do interior.",
      B: "Nasceu e cresceu em São Felipe, nunca morou em outro lugar e possui laços familiares com várias gerações locais.",
      C: "Viveu a maior parte da vida em Pacas e retornou a São Felipe apenas na velhice.",
      D: "Trabalhou como mascate viajante pela região antes de se fixar em São Felipe."
    },
    gabarito: "B"
  },
  {
    id: 16,
    pergunta: "Por que Valderez não deu continuidade aos seus estudos formais durante a infância?",
    alternativas: {
      A: "Porque não existiam professores dispostos a ensinar na região de São Felipe.",
      B: "Porque preferiu mudar-se definitivamente para o município de Pinheiro.",
      C: "Porque era muito apegado à sua mãe e não conseguia ficar longe dela, abandonando a escola em poucos dias.",
      D: "Porque foi proibido pelos proprietários das terras de frequentar as aulas."
    },
    gabarito: "C"
  },
  {
    id: 17,
    pergunta: "Segundo as memórias de Valderez, qual figura histórica é apontada por ele como o antigo proprietário que destinou aquelas terras aos moradores?",
    alternativas: {
      A: "Zunga",
      B: "Felipe Pereira",
      C: "Manuel Sebastião",
      D: "Silvério"
    },
    gabarito: "B"
  },
  {
    id: 18,
    pergunta: "De acordo com o relato de Valderez, como a imagem do padroeiro São Felipe chegou até a comunidade?",
    alternativas: {
      A: "Foi encontrada por agricultores enquanto escavavam a terra para o plantio.",
      B: "Foi trazida de Pinheiro por sua avó, Benedita Urbana Rodrigues, acompanhada da filha.",
      C: "Foi doada por missões religiosas que visitavam a Chapada de carro de boi.",
      D: "Foi esculpida em madeira por um morador antigo de Pacas."
    },
    gabarito: "B"
  },
  {
    id: 19,
    pergunta: "Antes de a comunidade de São Felipe contar com uma igreja estruturada, onde a comunidade se reunia para realizar atividades de ensino e celebrações?",
    alternativas: {
      A: "Em uma sala alugada na cidade vizinha de Pimenta.",
      B: "Em um barracão comunitário, onde a própria Dona Catarina também lecionava.",
      C: "Na casa do padre Tomaz Beckman.",
      D: "Em um galpão destinado à quebra de coco babaçu."
    },
    gabarito: "B"
  },
  {
    id: 20,
    pergunta: "Qual tradição religiosa coletiva, iniciada em reuniões nas casas dos próprios moradores (como Seu Eugênio, Seu Dudu e Dona Zefinha), permanece viva em São Felipe até os dias atuais?",
    alternativas: {
      A: "A festa do Bumba-meu-boi vindo de fora.",
      B: "A reza do mês de maio (novena).",
      C: "A farra de caixa.",
      D: "A procissão do dia dos finados."
    },
    gabarito: "B"
  },
  {
    id: 21,
    pergunta: "Para tratar problemas de saúde comuns do cotidiano, como a gripe, Dona Catarina costumava cultivar e utilizar um chá preparado com quais plantas?",
    alternativas: {
      A: "Arruda, aroeira e quina.",
      B: "Cebola, hortelã, gengibre e alfavaca.",
      C: "Malva-branca, boldo e folha de lima.",
      D: "Erva-cidreira, mastruz e alho-social."
    },
    gabarito: "B"
  },
  {
    id: 22,
    pergunta: "Como a rotina de trabalho das famílias agrícolas impactava o calendário escolar e a frequência dos alunos atendidos por Dona Catarina?",
    alternativas: {
      A: "As aulas eram canceladas no período de chuvas devido ao alagamento das estradas.",
      B: "As crianças eram retiradas temporariamente da escola para ajudar os pais na colheita do arroz ou nas atividades do rio.",
      C: "Os alunos estudavam apenas no período noturno para poderem quebrar coco babaçu durante o dia.",
      D: "A escola fechava durante todo o ano para os mutirões de construção de casas de taipa."
    },
    gabarito: "B"
  },
  {
    id: 23,
    pergunta: "O que Dona Catarina defende para evitar que as memórias e a história da comunidade de São Felipe se percam com o tempo?",
    alternativas: {
      A: "A obrigatoriedade de aulas de história apenas para os adultos da comunidade.",
      B: "A criação de oportunidades (como livros ou aplicativos) para registrar os relatos dos idosos e despertar o interesse dos jovens.",
      C: "A substituição das conversas com os mais velhos por pesquisas acadêmicas externas.",
      D: "O encerramento definitivo das celebrações religiosas antigas que perderam adeptos."
    },
    gabarito: "B"
  },
  {
    id: 24,
    pergunta: "Antes da chegada dos caminhões e das estradas modernas, como era realizado o transporte de cargas de Santa Rita até os armazéns em Pinheiro?",
    alternativas: {
      A: "Por meio de barcos a motor que navegavam diretamente pelo riacho local.",
      B: "Utilizando carros de boi que saíam de madrugada e faziam pausas estratégicas para descanso dos animais.",
      C: "Por meio de lombos de jumentos que viajavam apenas durante o período noturno.",
      D: "Utilizando carroças manuais puxadas pelos próprios moradores da comunidade."
    },
    gabarito: "B"
  },
  {
    id: 25,
    pergunta: "Qual inovação técnica modificou a prática da pesca na comunidade de Santa Rita após ser trazida pelo tio de Francisca (vindo de Araioses-MA)?",
    alternativas: {
      A: "A substituição dos riachos por açudes artificiais.",
      B: "A introdução das malhadeiras e do uso de linhas de náilon.",
      C: "O uso exclusivo de armadilhas de bambu conhecidas como arapucas.",
      D: "A criação de redes de arrasto puxadas por barcos a vapor."
    },
    gabarito: "B"
  },
  {
    id: 26,
    pergunta: "De acordo com os saberes tradicionais transmitidos pela mãe de Francisca, qual é a crença medicinal em relação ao mês de agosto?",
    alternativas: {
      A: "É o único mês em que se deve colher a raiz do mastruz para garantir sua eficiência.",
      B: "É considerado um período \"remoso\", devendo-se colher e guardar as plantas antes do seu início.",
      C: "É o período ideal para preparar chás de folhas frescas colhidas diretamente ao amanhecer.",
      D: "É um mês em que o uso de remédios de farmácia deve ser totalmente suspenso."
    },
    gabarito: "B"
  },
  {
    id: 27,
    pergunta: "Apesar de ter precisado conciliar os estudos com o trabalho na roça desde cedo, qual conselho principal Francisca deixa para os estudantes e jovens da nova geração?",
    alternativas: {
      A: "Que abandonem o trabalho no campo para viver exclusivamente nas grandes cidades.",
      B: "Que deem prioridade apenas ao aprendizado de funções manuais e agrícolas.",
      C: "Que continuem estudando sempre que tiverem oportunidade, pois o conhecimento garante autonomia.",
      D: "Que substituam os livros escolares pelo aprendizado exclusivo de cantigas e brincadeiras antigas."
    },
    gabarito: "C"
  },
  {
    id: 28,
    pergunta: "Quais elementos da paisagem local são destacados por Francisca como \"marcas físicas\" e testemunhas vivas da história centenária de Santa Rita?",
    alternativas: {
      A: "As antigas casas de taipa construídas por seu avô.",
      B: "As mangueiras centenárias e a grande jaqueira presentes desde sua infância.",
      C: "Os antigos fornos de farinha abandonados na beira do rio.",
      D: "Os velhos armazéns de madeira localizados no centro da comunidade."
    },
    gabarito: "B"
  },
  {
    id: 29,
    pergunta: "Quais atividades de extrativismo e trabalho no campo eram tradicionalmente realizadas pelas mulheres e pelos homens da comunidade de Santa Rita para garantir a sobrevivência das famílias?",
    alternativas: {
      A: "As mulheres trabalhavam no pastoreio do gado e os homens na produção de cerâmica.",
      B: "As mulheres iam para o mato quebrar coco e os homens trabalhavam no cultivo da roça.",
      C: "As mulheres cuidavam exclusivamente da pesca artesanal e os homens do comércio de carvão.",
      D: "As mulheres fabricavam ferramentas de madeira e os homens colhiam frutas nativas."
    },
    gabarito: "B"
  },
  {
    id: 30,
    pergunta: "Qual fator recente é apontado por Marinalva como uma dificuldade para a continuidade do plantio tradicional do arroz pelos moradores de Santa Rita?",
    alternativas: {
      A: "A falta de sementes e ferramentas agrícolas para compra na região.",
      B: "A perda do interesse da comunidade no consumo de arroz nas refeições.",
      C: "A restrição de acesso a determinadas áreas impostas por proprietários de terras.",
      D: "A escassez de água causada pela secagem definitiva do rio local."
    },
    gabarito: "C"
  },
  {
    id: 31,
    pergunta: "De que forma era confeccionada a estrutura artesanal do Bumba-meu-boi em Santa Rita para as apresentações que contavam com a participação de jovens e crianças?",
    alternativas: {
      A: "Com estruturas metálicas importadas da cidade e cobertas com lona sintética.",
      B: "Com pedaços de madeira, cabeça semelhante à de boi, cobertura de muruti e tecidos enfeitados.",
      C: "Com papelão reciclado e palha de milho trançada pelos idosos da comunidade.",
      D: "Com hastes de bambu e couro bovino curtido ao sol por vários meses."
    },
    gabarito: "B"
  },
  {
    id: 32,
    pergunta: "Com quem Marinalva aprendeu a reconhecer, cultivar e utilizar a grande variedade de plantas medicinais (como hortelã-pimenta, boldo, quina e casca de siriguela)?",
    alternativas: {
      A: "Com os professores da primeira escola inaugurada em São Romão.",
      B: "Com médicos itinerantes que visitavam a comunidade durante os festejos.",
      C: "Com sua mãe, a quem acompanhava no cultivo e no preparo de ervas caseiras.",
      D: "Com comerciantes de ervas que viajavam em carros de boi pela região."
    },
    gabarito: "C"
  },
  {
    id: 33,
    pergunta: "Qual mudança na infraestrutura comunitária é destacada por Marinalva como uma melhoria significativa para a rotina das crianças e das famílias de Santa Rita?",
    alternativas: {
      A: "A construção de um grande ginásio esportivo no centro da comunidade.",
      B: "A instalação de uma linha de ônibus urbano direto para a capital São Luís.",
      C: "A chegada da escola na própria comunidade e do transporte escolar para os alunos maiores.",
      D: "A criação de uma feira semanal de produtos medicinais na beira do rio."
    },
    gabarito: "C"
  },
  {
    id: 34,
    pergunta: "Como Francisca da Chagas Araújo exercia seu trabalho como parteira tradicional ao longo de cerca de vinte anos na comunidade?",
    alternativas: {
      A: "Cobrando valores fixos em dinheiro por cada atendimento prestado.",
      B: "Atendendo apenas familiares próximos e recusando outras moradoras.",
      C: "Cobrando exclusivamente em sacos de coco babaçu quentado.",
      D: "Trabalhando por solidariedade e sem cobrar pelo serviço, considerando uma ajuda comunitária."
    },
    gabarito: "D"
  },
  {
    id: 35,
    pergunta: "Diante de falta de energia elétrica na juventude, como Francisca fazia para conseguir estudar à noite no período de exames escolares?",
    alternativas: {
      A: "À luz de lamparina de querosene, mesmo cansada da jornada de trabalho.",
      B: "Utilizando velas trazidas das festas de tambor de crioula.",
      C: "Reunindo-se na casa da professora que possuía gerador.",
      D: "Estudando nas margens dos igarapés com o auxílio da lua cheia."
    },
    gabarito: "A"
  },
  {
    id: 36,
    pergunta: "Qual orientação religiosa e compromisso foram passados a Francisca por Zé Pretinho (seu pai de santo) em relação ao terreiro de Mina?",
    alternativas: {
      A: "Vender a estrutura do terreiro para financiar festejos de bumba-boi.",
      B: "Mudar o terreiro para a cidade de Presidente Sarney.",
      C: "Continuar zelando e cuidando do terreiro após a sua morte.",
      D: "Interromper todas as atividades religiosas após sua partida."
    },
    gabarito: "C"
  },
  {
    id: 37,
    pergunta: "Além das práticas tradicionais de saúde e cultura, qual função administrativa de responsabilidade comunitária Francisca desempenhou na associação?",
    alternativas: {
      A: "Presidente do sindicato de trabalhadores rurais.",
      B: "Tesoureira, responsável por fichas, comprovantes e registros.",
      C: "Secretária de saúde da rede pública municipal.",
      D: "Coordenadora do transporte escolar comunitário."
    },
    gabarito: "B"
  },
  {
    id: 38,
    pergunta: "Para conseguir itens básicos como açúcar, café e querosene, o que Francisca utilizava como moeda de troca ou pagamento a partir de seu trabalho extrativista?",
    alternativas: {
      A: "Peixes salgados obtidos nas pescarias noturnas.",
      B: "Sacos de farinha de mandioca produzidos em forno familiar.",
      C: "Quilos de coco babaçu quebrado por ela mesma.",
      D: "Ervas e garrafadas medicinais preparadas para os comerciantes."
    },
    gabarito: "C"
  },
  {
    id: 39,
    pergunta: "Qual área de mata histórica da comunidade é lembrada nos relatos de Santa Rita como um antigo ponto de abrigo para escravizados fugidos e onde eram encontrados objetos antigos?",
    alternativas: {
      A: "Ilha dos Pretos ou Mato dos Pretos, próxima ao Poção da Anta.",
      B: "Chapada do Bom Jardim, próximo ao povoado de Pacas.",
      C: "Corredor de Tubajara, próximo às margens do riacho principal.",
      D: "Roça de Toco, situada nas proximidades da sede do município."
    },
    gabarito: "A"
  },
  {
    id: 40,
    pergunta: "Diante da falta de mochila ou pasta escolar na infância, qual recurso criativo Ronaldo utilizava para proteger seus cadernos e livros no caminho enlameado até São Romão?",
    alternativas: {
      A: "Sacolas plásticas de mercado amarradas com tiras de pano.",
      B: "Sacos de fardo de arroz utilizados como pasta.",
      C: "Caixas de papelão vedadas com cera vegetal.",
      D: "Cestos artesanais feitos de palha de babaçu."
    },
    gabarito: "B"
  },
  {
    id: 41,
    pergunta: "O que acontece com as manifestações e festas culturais (como o tambor de crioula) na comunidade de Santa Rita quando ocorre o falecimento de um morador local?",
    alternativas: {
      A: "São transferidas imediatamente para a comunidade vizinha de Mato do Brito.",
      B: "Ocorrem apenas no período noturno e sem o uso de instrumentos de percussão.",
      C: "Ficam temporariamente suspensas por um período que dura de três a seis meses.",
      D: "São realizadas normalmente para homenagear a memória da pessoa falecida."
    },
    gabarito: "C"
  },
  {
    id: 42,
    pergunta: "Apesar de algumas áreas agrícolas utilizarem arado, qual técnica tradicional de cultivo ainda é predominantemente praticada pelos moradores no trabalho da roça?",
    alternativas: {
      A: "Agricultura de irrigação por gotejamento automatizado.",
      B: "Cultivo intensivo em estufas de plástico.",
      C: "Hidroponia comunitária nas margens dos rios.",
      D: "Roça no toco, praticada tradicionalmente entre as famílias."
    },
    gabarito: "D"
  },
  {
    id: 43,
    pergunta: "Segundo as histórias transmitidas pelos mais velhos e resgatadas por Ronaldo, de qual comunidade maior teriam se originado Santa Rita, Cocal e Bebe Fumo?",
    alternativas: {
      A: "Povoado do Leque.",
      B: "Quilombo Corredor.",
      C: "Chapada de Presidente Sarney.",
      D: "Comunidade de São Bento."
    },
    gabarito: "B"
  }
];

const PERGUNTAS_POR_NIVEL_QUIZ = 1;
const NIVEIS_QUIZ = [];
for (let i = 0; i < Math.ceil(PERGUNTAS_QUIZ_BRUTAS.length / PERGUNTAS_POR_NIVEL_QUIZ); i++) {
  const questoes = PERGUNTAS_QUIZ_BRUTAS
    .slice(i * PERGUNTAS_POR_NIVEL_QUIZ, i * PERGUNTAS_POR_NIVEL_QUIZ + PERGUNTAS_POR_NIVEL_QUIZ)
    .map(function (q) { return Object.assign({}, q); });
  if (questoes.length === 0) continue;
  NIVEIS_QUIZ.push({
    numero: i + 1,
    tempo_segundos: 20,
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
    descricao: 'Responda cada afirmação sobre as comunidades. ' + NIVEIS_VERDADEIRO_FALSO.length + ' níveis, 1 pergunta por nível, 20 segundos por nível.',
    total_niveis: NIVEIS_VERDADEIRO_FALSO.length,
    ativo: true
  },
  {
    slug: 'quiz',
    numero: 3,
    nome: 'Quiz',
    icone: 'quiz',
    descricao: 'Quiz de múltipla escolha sobre a memória das comunidades. ' + NIVEIS_QUIZ.length + ' níveis, 1 pergunta por nível, 4 alternativas, 20 segundos por nível.',
    total_niveis: NIVEIS_QUIZ.length,
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

function getNivelQuiz(numeroNivel) {
  const n = NIVEIS_QUIZ.find(x => x.numero === numeroNivel);
  if (!n) return null;
  return {
    numero: n.numero,
    tempo_segundos: n.tempo_segundos,
    questoes: n.questoes.map(q => ({
      id: q.id,
      pergunta: q.pergunta,
      alternativas: {
        A: q.alternativas.A,
        B: q.alternativas.B,
        C: q.alternativas.C,
        D: q.alternativas.D
      },
      gabarito: q.gabarito
    }))
  };
}

function getTotalNiveisQuiz() {
  return NIVEIS_QUIZ.length;
}

module.exports = {
  listarJogos,
  getJogo,
  getNivelCacaPalavras,
  getTotalNiveisCacaPalavras,
  getNivelVerdadeiroFalso,
  getTotalNiveisVerdadeiroFalso,
  getNivelQuiz,
  getTotalNiveisQuiz,
  NIVEIS_CACA_PALAVRAS,
  NIVEIS_VERDADEIRO_FALSO,
  NIVEIS_QUIZ,
  LISTA_JOGOS
};
