const MoradoresController = {
  index(req, res) {
    res.render('moradores/index', {
      title: 'Memórias dos Moradores',
      layout: 'main'
    });
  }
};

module.exports = MoradoresController;
