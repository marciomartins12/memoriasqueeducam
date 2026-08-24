class ComunidadesController {
  static index(req, res) {
    res.render('comunidades/index', {
      layout: 'main',
      title: 'Conheça as Comunidades'
    });
  }
}

module.exports = ComunidadesController;
