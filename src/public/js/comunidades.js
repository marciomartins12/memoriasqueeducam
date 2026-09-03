(function () {
  'use strict';

  var TEXTOS_MODAL = {
    'sao-felipe': {
      surgiu: {
        titulo: 'História de São Felipe',
        conteudo: [
          'Segundo as memórias e relatos transmitidos pelos moradores, a história da comunidade de São Felipe está relacionada à ocupação antiga das terras e à presença de Felipe Pereira, apontado pelos relatos como proprietário do local. De acordo com as entrevistas realizadas, Felipe Pereira teria permanecido por muitos anos na região e possuía um espaço onde eram produzidos potes de barro, atividade que fazia parte das práticas desenvolvidas naquele período. Também é lembrado que eram utilizados carros de boi para transportar coco até a região da Chapada, passando pelas terras de São Felipe.',
          'Conforme os relatos dos moradores, os primeiros habitantes a chegar ao território vieram da região de São Bento-MA e eram pessoas escravizadas que haviam fugido das condições de escravidão. Essas pessoas teriam encontrado naquele território um espaço onde poderiam se estabelecer e construir suas vidas, dando início ao processo de ocupação que posteriormente contribuiu para a formação da comunidade. A presença desses primeiros moradores é lembrada como parte importante da origem da comunidade e de sua trajetória enquanto território quilombola.',
          'Depois de alguns anos, segundo a memória oral dos moradores, outras pessoas e famílias chegaram ao local e passaram a ocupar as terras. Entre os nomes lembrados nas entrevistas estão Dona Faustina, Saturnina, Silvério, Maria Constância, Sabiá Honório e Jacinto. Essas pessoas são mencionadas nas memórias da comunidade como parte do processo de formação do povoado e da continuidade da ocupação do território.',
          'Com o passar das gerações, novas famílias foram constituídas e a comunidade foi se desenvolvendo por meio das relações de parentesco, do trabalho, da agricultura, da convivência entre os moradores e das práticas religiosas e culturais. As atividades realizadas pelos antigos moradores contribuíram para a construção da vida comunitária e para a transmissão de conhecimentos entre as gerações.',
          'A comunidade possui uma história de mais de cinquenta anos, marcada pelas experiências dos moradores mais antigos, pela formação das famílias e pela construção de espaços de convivência, trabalho e religiosidade. As lembranças sobre os primeiros habitantes, as formas de trabalho e as atividades desenvolvidas no território fazem parte da memória coletiva de São Felipe e ajudam a compreender as transformações ocorridas na comunidade ao longo do tempo.',
          'Além das memórias transmitidas oralmente, São Felipe possui reconhecimento oficial como comunidade remanescente de quilombo. Conforme a fonte consultada, a comunidade foi certificada nessa condição por meio da Portaria de 07 de fevereiro de 2007. Esse reconhecimento reforça a importância da preservação de sua história, de sua identidade cultural e dos saberes tradicionais construídos e transmitidos pelas diferentes gerações.',
          'A história de São Felipe, portanto, é construída a partir das memórias sobre a chegada dos primeiros moradores vindos de São Bento-MA, identificados nos relatos como pessoas escravizadas que haviam fugido, seguida pela chegada de outras famílias que contribuíram para a formação do povoado. As lembranças sobre Felipe Pereira, a produção de potes de barro, o transporte de coco em carros de boi, o trabalho, a religiosidade e a formação das famílias compõem um conjunto de memórias fundamentais para compreender a trajetória da comunidade e valorizar seus saberes tradicionais e sua identidade quilombola.'
        ].join('\n\n')
      },
      localizacao: {
        titulo: 'Localização de São Felipe',
        conteudo: 'A comunidade de São Felipe está localizada no Município de Presidente Sarney, estado do Maranhão, na Região Norte do estado. Seu território integra a paisagem do cerrado maranhense, com áreas de mata, campos e vales próximos à Chapada das Mangabeiras, região tradicionalmente utilizada para o transporte de produtos agrícolas como o coco, conforme lembranças dos moradores mais antigos. A proximidade com rodovias municipais permite o escoamento da produção agrícola familiar e o acesso a serviços públicos de saúde e educação nos povoados vizinhos e na sede do Município.'
      },
      fotos: {
        titulo: 'Acervo Virtual da Comunidade',
        conteudo: 'As fotografias de São Felipe registram o cotidiano dos moradores, as paisagens do território, os espaços de convivência e as práticas culturais e religiosas que compõem a memória coletiva da comunidade. Entre os registros destacam-se as imagens das casas de barro e alvenaria construídas ao longo das gerações, das áreas de cultivo de mandioca, milho e feijão, das festas religiosas e de datas comemorativas, das crianças brincando nos espaços comunitários e dos moradores mais idosos, guardiões das histórias transmitidas oralmente. Essas imagens são instrumentos importantes para a preservação da identidade quilombola e para a valorização da trajetória de mais de cinquenta anos da comunidade.'
      }
    },
    'santa-rita': {
      surgiu: {
        titulo: 'História de Santa Rita',
        conteudo: 'A comunidade Santa Rita, localizada no Município de Presidente Sarney (MA), constitui-se como uma comunidade remanescente de quilombo. Sua formação está ligada à tradição de núcleos familiares que estabeleceram-se no território transmitindo, entre gerações, práticas culturais, religiosas e de subsistência vinculadas à agricultura familiar, à pesca, à quebra do coco babaçu e ao extrativismo, atividades que permanecem no cotidiano dos moradores. As memórias orais transmitidas pelos mais antigos contam que as primeiras famílias que compuseram Santa Rita chegaram ao local buscando terras para trabalhar e construir suas vidas em liberdade. Com o passar dos anos, novas famílias se uniram por laços de parentesco, compadrio e vizinhança, consolidando o povoamento. A identidade quilombola de Santa Rita é permanentemente reforçada pela tradição, pelas festas de santos padroeiros e pela transmissão dos saberes tradicionais entre gerações.'
      },
      localizacao: {
        titulo: 'Localização de Santa Rita',
        conteudo: 'Santa Rita está situada no Município de Presidente Sarney, no estado do Maranhão. O território da comunidade possui áreas de mata nativa, várzeas e campos de cultivo próximos a pequenos cursos d\'água regionais, o que favorece as atividades de subsistência tradicionais, como a agricultura de sequeiro, o extrativismo de frutos e a pesca em riachos locais. Acesso por estradas vicinais liga a comunidade à sede municipal e aos povoados vizinhos, facilitando a ida aos serviços de saúde, educação e comercialização dos excedentes da produção familiar.'
      },
      fotos: {
        titulo: 'Acervo Virtual da Comunidade',
        conteudo: 'As fotografias de Santa Rita retratam a vida comunitária: os roçados de subsistência (mandioca, feijão, milho), a quebra do coco babaçu feita pelas mulheres, as crianças na escola comunitária, as festas do padroeiro, as casas do povoado, as paisagens do entorno e os moradores mais antigos, que guardam a história do lugar. Esses registros visuais ajudam a contar a trajetória do território e a manter viva a memória coletiva da comunidade para as gerações futuras.'
      }
    }
  };

  function abrirModal(modal, tituloEl, corpoEl, info, comunidade) {
    var chaveComunidade = TEXTOS_MODAL[comunidade];
    if (!chaveComunidade) return;
    var chaveInfo = chaveComunidade[info];
    if (!chaveInfo) return;

    tituloEl.textContent = chaveInfo.titulo;
    corpoEl.innerHTML = '';

    var paragrafos = chaveInfo.conteudo
      .split(/\n{2,}/)
      .filter(function (p) { return p && p.trim().length; });

    paragrafos.forEach(function (texto) {
      var p = document.createElement('p');
      p.className = 'modal-info-paragrafo';
      p.textContent = texto.trim().replace(/\s+/g, ' ');
      corpoEl.appendChild(p);
    });

    modal.classList.add('modal-info-aberto');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-info-aberto');
    corpoEl.scrollTop = 0;

    try {
      var fecharBtn = modal.querySelector('.modal-info-fechar');
      if (fecharBtn) fecharBtn.focus();
    } catch (e) {}
  }

  function fecharModal(modal) {
    modal.classList.remove('modal-info-aberto');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-info-aberto');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var abas = document.querySelectorAll('.comunidades-abas .aba');
    var conteudos = document.querySelectorAll('.comunidade-conteudo');
    var modal = document.querySelector('.modal-info');
    var modalTitulo = document.querySelector('#modalInfoTitulo');
    var modalCorpo = document.querySelector('#modalInfoCorpo');
    var infoItens = document.querySelectorAll('.info-item');
    var fecharTriggers = document.querySelectorAll('[data-modal-fechar]');

    if (abas.length && conteudos.length) {
      function ativarAba(nome) {
        abas.forEach(function (aba) {
          var ativa = aba.getAttribute('data-aba') === nome;
          aba.classList.toggle('aba-ativa', ativa);
          aba.setAttribute('aria-selected', ativa ? 'true' : 'false');
        });

        conteudos.forEach(function (conteudo) {
          var mostrar = conteudo.getAttribute('data-conteudo') === nome;
          if (mostrar) {
            conteudo.hidden = false;
            conteudo.removeAttribute('hidden');
            conteudo.classList.remove('comunidade-conteudo-inativo');
          } else {
            conteudo.hidden = true;
            conteudo.setAttribute('hidden', '');
            conteudo.classList.add('comunidade-conteudo-inativo');
          }
        });

        var scrollArea = document.querySelector('.comunidades-conteudo-scroll');
        if (scrollArea) scrollArea.scrollTop = 0;
      }

      abas.forEach(function (aba) {
        aba.addEventListener('click', function () {
          var nome = aba.getAttribute('data-aba');
          if (nome) ativarAba(nome);
        });
      });

      if (!document.querySelector('.comunidade-conteudo:not([hidden])')) {
        ativarAba('sao-felipe');
      }
    }

    if (modal && modalTitulo && modalCorpo && infoItens.length) {
      infoItens.forEach(function (item) {
        item.addEventListener('click', function () {
          var info = item.getAttribute('data-info');
          var comunidade = item.getAttribute('data-comunidade');
          abrirModal(modal, modalTitulo, modalCorpo, info, comunidade);
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });
      });

      fecharTriggers.forEach(function (el) {
        el.addEventListener('click', function () {
          fecharModal(modal);
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-info-aberto')) {
          fecharModal(modal);
        }
      });
    }
  });
})();
