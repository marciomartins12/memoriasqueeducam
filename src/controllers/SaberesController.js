const { listarCategorias, getCategoria } = require('../models/Saberes');

class SaberesController {
  static async index(req, res) {
    try {
      const categorias = listarCategorias();
      return res.render('saberes/index', {
        title: 'Saberes Tradicionais',
        categorias: categorias
      });
    } catch (err) {
      console.error('Erro ao carregar Saberes Tradicionais:', err);
      return res.redirect('/dashboard');
    }
  }

  static async categoria(req, res) {
    try {
      const { slug } = req.params;
      const categoria = getCategoria(slug);
      if (!categoria) {
        return res.redirect('/saberes');
      }
      const categoriasTodas = listarCategorias();
      return res.render('saberes/categoria', {
        title: `${categoria.nome} - Saberes Tradicionais`,
        categoria: categoria,
        categorias: categoriasTodas
      });
    } catch (err) {
      console.error('Erro ao carregar categoria:', err);
      return res.redirect('/saberes');
    }
  }
}

module.exports = SaberesController;
