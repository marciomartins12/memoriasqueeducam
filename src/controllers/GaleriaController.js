const fs = require('fs');
const path = require('path');

class GaleriaController {
  static index(req, res) {
    try {
      const galeriaDir = path.join(__dirname, '..', 'public', 'img', 'galeria');

      const pastas = [
        { slug: 'santaRita', nome: 'Santa Rita', dir: path.join(galeriaDir, 'santaRita') },
        { slug: 'saoFelipe', nome: 'São Felipe', dir: path.join(galeriaDir, 'saoFelipe') }
      ];

      const fotos = [];
      pastas.forEach(pasta => {
        if (fs.existsSync(pasta.dir)) {
          const arquivos = fs.readdirSync(pasta.dir)
            .filter(arq => /\.(jpe?g|png|webp|gif)$/i.test(arq))
            .sort((a, b) => {
              const extractNum = s => {
                const m = s.match(/\((\d+)\)/);
                return m ? parseInt(m[1], 10) : 0;
              };
              return extractNum(a) - extractNum(b);
            });
          arquivos.forEach(arq => {
            fotos.push({
              id: `${pasta.slug}-${arq}`,
              comunidade: pasta.slug,
              comunidadeNome: pasta.nome,
              src: `/img/galeria/${pasta.slug}/${encodeURIComponent(arq)}`,
              nome: arq
            });
          });
        }
      });

      const videos = [];
      const arquivosVideos = fs.existsSync(galeriaDir)
        ? fs.readdirSync(galeriaDir).filter(arq => /\.(mov|mp4|webm|m4v|avi|mkv)$/i.test(arq))
        : [];
      arquivosVideos.forEach(arq => {
        videos.push({
          id: `video-${arq}`,
          comunidade: 'todos',
          comunidadeNome: 'Memórias que Educam',
          src: `/img/galeria/${encodeURIComponent(arq)}`,
          nome: arq.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || arq,
          tipo: 'video'
        });
      });

      return res.render('galeria/index', {
        layout: 'main',
        title: 'Galeria - Memórias que Educam',
        fotos: fotos,
        videos: videos
      });
    } catch (err) {
      console.error('Erro ao carregar galeria:', err);
      return res.redirect('/dashboard');
    }
  }
}

module.exports = GaleriaController;
