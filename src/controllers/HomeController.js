class HomeController {
  static index(req, res) {
    res.render('home/index', {
      layout: 'main',
      title: 'Página 1'
    });
  }
}

module.exports = HomeController;
