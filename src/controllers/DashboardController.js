class DashboardController {
  static index(req, res) {
    res.render('dashboard/index', {
      layout: 'main',
      title: 'Memórias que Educam - Menu'
    });
  }

  static sobre(req, res) {
    res.render('dashboard/sobre', {
      layout: 'main',
      title: 'Memórias que Educam - Sobre o Site'
    });
  }
}

module.exports = DashboardController;
