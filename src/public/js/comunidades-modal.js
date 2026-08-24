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
    fotos: 'Fotos da comunidade'
  };

  var CONTEUDOS = {
    'sao-felipe': {
      surgiu: [
        'Segundo a memória oral dos moradores, a história da comunidade de São Felipe está relacionada a uma antiga propriedade de terras pertencente a Felipe Pereira, apontado como senhor de pessoas escravizadas. Com o passar do tempo, a fazenda entrou em decadência à medida que os membros da família proprietária foram falecendo. Nesse contexto, algumas das pessoas escravizadas que viviam no local passaram a ocupar as terras, sendo lembradas nos relatos como Dona Faustina, Saturnina, Silvério, Maria Constância, Sabiá Honório e Jacinto.',
        'Essas pessoas são mencionadas nas memórias da comunidade como parte do processo de ocupação e formação do povoado. Posteriormente, segundo os relatos, foi encontrado no local um santo de madeira, identificado como São Felipe. A partir desse acontecimento, o santo passou a ser homenageado pela comunidade, contribuindo para a origem do nome do povoado, que passou a ser conhecido como São Felipe.',
        'A comunidade possui uma história de mais de quarenta anos, marcada pela presença de diferentes gerações, pela formação das famílias e pela construção de espaços de convivência, religiosidade e trabalho. Ao longo desse período, os moradores contribuíram para o desenvolvimento da comunidade e para a preservação de suas tradições culturais e religiosas.',
        'Além das memórias transmitidas oralmente, São Felipe também possui reconhecimento oficial como comunidade remanescente de quilombo. Conforme a fonte consultada, a comunidade foi certificada nessa condição por meio da Portaria de 07 de fevereiro de 2007. Esse reconhecimento reforça a importância de preservar sua história, sua identidade cultural e os saberes tradicionais construídos e transmitidos pelas diferentes gerações.',
        'A história de São Felipe, portanto, está ligada às memórias sobre a presença de pessoas escravizadas, à ocupação das terras e à formação das famílias que deram continuidade à vida no local. Essas memórias, somadas ao reconhecimento oficial da comunidade, são fundamentais para compreender sua trajetória enquanto comunidade quilombola e valorizar os conhecimentos transmitidos oralmente entre as gerações.'
      ],
      localizacao: [
        'A comunidade São Felipe está localizada no município de Presidente Sarney, estado do Maranhão (MA), região Nordeste do Brasil). Seu território integra a paisagem típica do leste maranhense, com áreas de vegetação, roças, cursos dágua e estradas vicinais que a conectam ao restante do município e aos povoados vizinhos, incluindo a comunidade de Santa Rita.',
        'A proximidade entre São Felipe e Santa Rita revela uma longa história de compartilhamento de território, de trocas culturais e de convivência entre as famílias que compõem as duas comunidades. Ambas se reconhecem como pertencentes à mesma região, partilhando laços de parentesco, de tradições e de memórias sobre a ocupação da terra e a formação dos povoados.',
        'A posição geográfica da comunidade, bem como sua relação histórica com o território, são elementos essenciais para compreender a identidade de seus moradores, a transmissão dos saberes tradicionais e a importância do reconhecimento oficial como comunidade remanescente de quilombo.'
      ],
      fotos: [
        'Acervo visual da comunidade São Felipe: as fotos da comunidade reúnem registros dos espaços coletivos, como a sede, a escola, os terreiros e as áreas de convivência; das paisagens do entorno, com roças, palmeiras e cursos dágua; e das atividades tradicionais e momentos de festa e celebração.',
        'Esses registros são fundamentais para preservar a memória coletiva, mostrando como diferentes gerações construíram e transformaram o território ao longo dos anos, como também para reconhecer e valorizar os costumes, os festejos e as práticas que definem a identidade quilombola de São Felipe.',
        'A seção Fotos da comunidade reúne também fotografias de atividades cotidiano dos moradores, das casas e das manifestações culturais e religiosas, representam a riqueza cultural do patrimônio imaterial e material preservada comunidade.'
      ]
    },
    'santa-rita': {
      surgiu: [
        'A comunidade Santa Rita, localizada no município de Presidente Sarney (MA), possui uma trajetória marcada pela formação gradual de um pequeno núcleo de moradores e pela preservação de práticas culturais e modos de vida tradicionais. Segundo os relatos dos moradores, no início de sua formação, a comunidade era pequena, reunindo aproximadamente dez famílias. Entre os primeiros moradores é mencionado o senhor Amadeus Ramos, considerado um dos mais antigos habitantes do povoado. Posteriormente, outras famílias foram chegando, entre elas a família Amorim, contribuindo para o crescimento e a ocupação do território. A organização da comunidade também esteve associada à atuação de lideranças locais, como o senhor conhecido pelo apelido de Zé Pato.',
        'Durante esse período inicial, a subsistência dos moradores estava fortemente relacionada às atividades desenvolvidas no próprio território. Os relatos apontam para a importância da agricultura, da criação de animais e da quebra do coco, atividades que constituíam importantes formas de trabalho e sustento das famílias. A pesca também fazia parte do modo de vida da comunidade, evidenciando uma relação próxima entre os moradores, a terra e os recursos naturais disponíveis. Essas práticas não representavam apenas meios de sobrevivência, mas também formas de transmissão de conhecimentos e costumes entre as gerações, contribuindo para a construção da identidade coletiva da comunidade.',
        'O processo de desenvolvimento de Santa Rita também pode ser observado a partir da construção de espaços destinados à educação e à convivência comunitária. Inicialmente, a escola funcionava em um barracão de taipa construído pelos próprios moradores, Ribinha e Panhé, tendo Maria Lindalva como primeira professora. Posteriormente, durante a administração do prefeito Edson Chagas (2009–2016), foi construído um barracão de alvenaria para atender à comunidade, onde passaram a ocorrer as aulas. Em seguida, a igreja católica também chegou a ser utilizada como espaço escolar. Somente em 10 de agosto de 2020 foi inaugurado um prédio próprio para a escola, construído por meio do Programa Escola Digna, em parceria entre os governos estadual e municipal, contando com salas de aula, banheiros, cozinha e poço artesiano.',
        'Atualmente, Santa Rita apresenta uma estrutura comunitária mais desenvolvida, contando com dezenas de residências e equipamentos como sede comunitária, escola, igreja católica, poço artesiano com reservatório elevado e casa de forno de farinha. Apesar das transformações ocorridas ao longo do tempo, permanecem importantes práticas econômicas e culturais herdadas das gerações anteriores. A agricultura, a pesca, a criação de animais e a produção de farinha continuam relacionadas ao cotidiano dos moradores, enquanto manifestações culturais e religiosas, como o tambor de mina, o tambor de crioula, os terreiros e o bumba meu boi, demonstram a riqueza das tradições preservadas pela comunidade.',
        'A dimensão religiosa também ocupa lugar de destaque na vida coletiva, especialmente durante a festa realizada no mês de novembro em homenagem a Santa Rita. Essas manifestações constituem importantes momentos de encontro e fortalecimento dos vínculos entre os moradores, contribuindo para a preservação da memória e das tradições locais. Além disso, o reconhecimento de Santa Rita como comunidade remanescente de quilombo, por meio da certificação mencionada na documentação, reforça a importância de sua história, de seus saberes tradicionais e de sua relação com o território.'
      ],
      localizacao: [
        'A comunidade Santa Rita está localizada no município de Presidente Sarney, estado do Maranhão (MA), integrando a região do leste maranhense. Seu território compreende áreas de vegetação nativa, roças tradicionais, cursos dágua e estradas vicinais que a conectam à sede do município e à vizinha comunidade de São Felipe.',
        'A localização de Santa Rita reflete uma longa trajetória de ocupação e uso da terra por parte das famílias que se dedicavam à agricultura, à pesca, à quebra do coco e à criação de animais, atividades permanecem presentes na memória e no dia a dia dos moradores.',
        'A proximidade com São Felipe e com os demais povoados da região contribui para a circulação de pessoas, de saberes e de tradições entre as comunidades, fortalecendo os laços de vizinhança e o sentimento de pertencimento territórios quilombolas do município.'
      ],
      fotos: [
        'Acervo visual da comunidade Santa Rita: as fotografias da comunidade registram os espaços de convivência e os equipamentos comunitários construídos ao longo dos anos, entre eles a sede comunitária, a escola inaugurada em 2020, a igreja, o poço artesiano, o forno de farinha.',
        'As imagens também documentam as práticas tradicionais ligadas à agricultura, à pesca, à quebra do coco e à produção de farinha, bem como as manifestações culturais e religiosas que compõem a identidade de Santa Rita, entre elas o tambor de mina, o tambor de crioula, os terreiros e o bumba meu boi.',
        'A seção Fotos da comunidade constitui um importante recurso para a memória coletiva ao longo do tempo e preservação da história preservando o modo de vida da população, das famílias, das paisagens e das tradições quilombola.'
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
