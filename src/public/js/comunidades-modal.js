(function () {
  'use strict';

  var modalEl = document.getElementById('modalInfo');
  if (!modalEl) return;

  var modalTitulo = document.getElementById('modalInfoTitulo');
  var modalCorpo = document.getElementById('modalInfoCorpo');
  if (!modalTitulo || !modalCorpo) return;

  var lastFocus = null;

  var TITULOS = {
    surgiu: 'Como surgiu',
    localizacao: 'Localização',
    fotos: 'Acervo Virtual da Comunidade'
  };

  var CONTEUDOS = {
    'sao-felipe': {
      surgiu: [
        'Segundo as memórias e relatos transmitidos pelos moradores, a história da comunidade de São Felipe está relacionada à ocupação antiga das terras e à presença de Felipe Pereira, apontado pelos relatos como proprietário do local. De acordo com as entrevistas realizadas, Felipe Pereira teria permanecido por muitos anos na região e possuía um espaço onde eram produzidos potes de barro, atividade que fazia parte das práticas desenvolvidas naquele período. Também é lembrado que eram utilizados carros de boi para transportar coco até a região da Chapada, passando pelas terras de São Felipe.',
        'Conforme os relatos dos moradores, os primeiros habitantes a chegar ao território vieram da região de São Bento-MA e eram pessoas escravizadas que haviam fugido das condições de escravidão. Essas pessoas teriam encontrado naquele território um espaço onde poderiam se estabelecer e construir suas vidas, dando início ao processo de ocupação que posteriormente contribuiu para a formação da comunidade. A presença desses primeiros moradores é lembrada como parte importante da origem da comunidade e de sua trajetória enquanto território quilombola.',
        'Depois de alguns anos, segundo a memória oral dos moradores, outras pessoas e famílias chegaram ao local e passaram a ocupar as terras. Entre os nomes lembrados nas entrevistas estão Dona Faustina, Saturnina, Silvério, Maria Constância, Sabiá Honório e Jacinto. Essas pessoas são mencionadas nas memórias da comunidade como parte do processo de formação do povoado e da continuidade da ocupação do território.',
        'Com o passar das gerações, novas famílias foram constituídas e a comunidade foi se desenvolvendo por meio das relações de parentesco, do trabalho, da agricultura, da convivência entre os moradores e das práticas religiosas e culturais. As atividades realizadas pelos antigos moradores contribuíram para a construção da vida comunitária e para a transmissão de conhecimentos entre as gerações. A comunidade possui uma história de mais de cinquenta anos, marcada pelas experiências dos moradores mais antigos, pela formação das famílias e pela construção de espaços de convivência, trabalho e religiosidade. As lembranças sobre os primeiros habitantes, as formas de trabalho e as atividades desenvolvidas no território fazem parte da memória coletiva de São Felipe e ajudam a compreender as transformações ocorridas na comunidade ao longo do tempo.',
        'Além das memórias transmitidas oralmente, São Felipe possui reconhecimento oficial como comunidade remanescente de quilombo. Conforme a fonte consultada, a comunidade foi certificada nessa condição por meio da Portaria de 07 de fevereiro de 2007. Esse reconhecimento reforça a importância da preservação de sua história, de sua identidade cultural e dos saberes tradicionais construídos e transmitidos pelas diferentes gerações.',
        'A história de São Felipe, portanto, é construída a partir das memórias sobre a chegada dos primeiros moradores vindos de São Bento-MA, identificados nos relatos como pessoas escravizadas que haviam fugido, seguida pela chegada de outras famílias que contribuíram para a formação do povoado. As lembranças sobre Felipe Pereira, a produção de potes de barro, o transporte de coco em carros de boi, o trabalho, a religiosidade e a formação das famílias compõem um conjunto de memórias fundamentais para compreender a trajetória da comunidade e valorizar seus saberes tradicionais e sua identidade quilombola.'
      ],
      localizacao: [
        "A comunidade São Felipe está localizada no Município de Presidente Sarney, estado do Maranhão (MA), região Nordeste do Brasil). Seu território integra a paisagem típica do leste maranhense, com áreas de vegetação, roças, cursos d'água e estradas vicinais que a conectam ao restante do Município e aos povoados vizinhos, incluindo a comunidade de Santa Rita.",
       "A proximidade entre São Felipe e Santa Rita revela uma longa história de compartilhamento de território, de trocas culturais e de convivência entre as famílias que compõem as duas comunidades. Ambas se reconhecem como pertencentes à mesma região, partilhando laços de parentesco, de tradições e de memórias sobre a ocupação da terra e a formação dos povoados.",
        'A posição geográfica da comunidade, bem como sua relação histórica com o território, são elementos essenciais para compreender a identidade de seus moradores, a transmissão dos saberes tradicionais e a importância do reconhecimento oficial como comunidade remanescente de quilombo.'
      ],
      fotos: [
        "Acervo visual da comunidade São Felipe: as fotos da comunidade reúnem registros dos espaços coletivos, como a sede, a escola, os terreiros e as áreas de convivência; das paisagens do entorno, com roças, palmeiras e cursos d'água; e das atividades tradicionais e momentos de festa e celebração.",
        "Esses registros são fundamentais para preservar a memória coletiva, mostrando como diferentes gerações construíram e transformaram o território ao longo dos anos, como também para reconhecer e valorizar os costumes, os festejos e as práticas que definem a identidade quilombola de São Felipe.",
        "O Acervo Virtual da Comunidade reúne também fotografias de atividades cotidiano dos moradores, das casas e das manifestações culturais e religiosas, representam a riqueza cultural do patrimônio imaterial e material preservada comunidade."
      ]
    },
    'santa-rita': {
      surgiu: [
        'A comunidade Santa Rita, localizada no Município de Presidente Sarney (MA), possui uma trajetória marcada pela formação gradual de um pequeno núcleo de moradores e pela preservação de práticas culturais e modos de vida tradicionais. Segundo os relatos dos moradores, no início de sua formação, a comunidade era pequena, reunindo aproximadamente dez famílias. Entre os primeiros moradores é mencionado o senhor Amadeus Ramos, considerado um dos mais antigos habitantes do povoado. Posteriormente, outras famílias foram chegando, entre elas a família Amorim, contribuindo para o crescimento e a ocupação do território. A organização da comunidade também esteve associada à atuação de lideranças locais, como o senhor conhecido pelo apelido de Zé Pato.',
        'Durante esse período inicial, a subsistência dos moradores estava fortemente relacionada às atividades desenvolvidas no próprio território. Os relatos apontam para a importância da agricultura, da criação de animais e da quebra do coco, atividades que constituíam importantes formas de trabalho e sustento das famílias. A pesca também fazia parte do modo de vida da comunidade, evidenciando uma relação próxima entre os moradores, a terra e os recursos naturais disponíveis. Essas práticas não representavam apenas meios de sobrevivência, mas também formas de transmissão de conhecimentos e costumes entre as gerações, contribuindo para a construção da identidade coletiva da comunidade.',
        'O processo de desenvolvimento de Santa Rita também pode ser observado a partir da construção de espaços destinados à educação e à convivência comunitária. Inicialmente, a escola funcionava em um barracão de taipa construído pelos próprios moradores, Ribinha e Panhé, tendo Maria Lindalva como primeira professora. Posteriormente, durante a administração do prefeito Edson Chagas (2009–2016), foi construído um barracão de alvenaria para atender à comunidade, onde passaram a ocorrer as aulas. Em seguida, a igreja católica também chegou a ser utilizada como espaço escolar. Somente em 10 de agosto de 2020 foi inaugurado um prédio próprio para a escola, construído por meio do Programa Escola Digna, em parceria entre os governos estadual e municipal, contando com salas de aula, banheiros, cozinha e poço artesiano.',
        'Atualmente, Santa Rita apresenta uma estrutura comunitária mais desenvolvida, contando com dezenas de residências e equipamentos como sede comunitária, escola, igreja católica, poço artesiano com reservatório elevado e casa de forno de farinha. Apesar das transformações ocorridas ao longo do tempo, permanecem importantes práticas econômicas e culturais herdadas das gerações anteriores. A agricultura, a pesca, a criação de animais e a produção de farinha continuam relacionadas ao cotidiano dos moradores, enquanto manifestações culturais e religiosas, como o tambor de mina, o tambor de crioula, os terreiros e o bumba meu boi, demonstram a riqueza das tradições preservadas pela comunidade.',
        'A dimensão religiosa também ocupa lugar de destaque na vida coletiva, especialmente durante a festa realizada no mês de novembro em homenagem a Santa Rita. Essas manifestações constituem importantes momentos de encontro e fortalecimento dos vínculos entre os moradores, contribuindo para a preservação da memória e das tradições locais. Além disso, o reconhecimento de Santa Rita como comunidade remanescente de quilombo, por meio da certificação mencionada na documentação, reforça a importância de sua história, de seus saberes tradicionais e de sua relação com o território.'
      ],
      localizacao: [
        "A comunidade Santa Rita está localizada no Município de Presidente Sarney, estado do Maranhão (MA), integrando a região do leste maranhense. Seu território compreende áreas de vegetação nativa, roças tradicionais, cursos d'água e estradas vicinais que a conectam à sede do Município e à vizinha comunidade de São Felipe.",
        'A localização de Santa Rita reflete uma longa trajetória de ocupação e uso da terra por parte das famílias que se dedicavam à agricultura, à pesca, à quebra do coco e à criação de animais, atividades permanecem presentes na memória e no dia a dia dos moradores.',
        'A proximidade com São Felipe e com os demais povoados da região contribui para a circulação de pessoas, de saberes e de tradições entre as comunidades, fortalecendo os laços de vizinhança e o sentimento de pertencimento territórios quilombolas do Município.'
      ],
      fotos: [
        'Acervo visual da comunidade Santa Rita: as fotografias da comunidade registram os espaços de convivência e os equipamentos comunitários construídos ao longo dos anos, entre eles a sede comunitária, a escola inaugurada em 2020, a igreja, o poço artesiano, o forno de farinha.',
        'As imagens também documentam as práticas tradicionais ligadas à agricultura, à pesca, à quebra do coco e à produção de farinha, bem como as manifestações culturais e religiosas que compõem a identidade de Santa Rita, entre elas o tambor de mina, o tambor de crioula, os terreiros e o bumba meu boi.',
        'O Acervo Virtual da Comunidade constitui um importante recurso para a memória coletiva ao longo do tempo e preservação da história preservando o modo de vida da população, das famílias, das paisagens e das tradições quilombola.'
      ]
    }
  };

  function escaparHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[c];
    });
  }

  function abrirModal(comunidade, info) {
    var titulo = TITULOS[info];
    var paragrafos = CONTEUDOS[comunidade] && CONTEUDOS[comunidade][info];
    if (!titulo || !paragrafos) return;

    lastFocus = document.activeElement;

    modalTitulo.textContent = titulo;

    var html = '';
    for (var i = 0; i < paragrafos.length; i++) {
      html += '<p>' + escaparHtml(paragrafos[i]) + '</p>';
    }
    modalCorpo.innerHTML = html;
    modalCorpo.scrollTop = 0;

    modalEl.classList.add('modal-info-aberto');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-info-aberto');

    var btnFechar = modalEl.querySelector('.modal-info-fechar');
    if (btnFechar && typeof btnFechar.focus === 'function') {
      setTimeout(function () { btnFechar.focus(); }, 30);
    }
  }

  function fecharModal() {
    modalEl.classList.remove('modal-info-aberto');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-info-aberto');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
      lastFocus = null;
    }
  }

  document.addEventListener('click', function (e) {
    var infoEl = e.target && e.target.closest && e.target.closest('.info-item');
    if (infoEl) {
      e.preventDefault();
      var comunidade = infoEl.getAttribute('data-comunidade');
      var info = infoEl.getAttribute('data-info');
      if (comunidade && info) abrirModal(comunidade, info);
      return;
    }
    if (e.target && e.target.closest && e.target.closest('[data-modal-fechar]')) {
      e.preventDefault();
      fecharModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalEl.classList.contains('modal-info-aberto')) {
      fecharModal();
    }
  });

  modalEl.addEventListener('click', function (e) {
    if (e.target === modalEl) fecharModal();
  });
})();
