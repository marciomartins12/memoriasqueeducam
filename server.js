require('dotenv').config();
const path = require('path');
const express = require('express');
const { setupHandlebars } = require('./src/config/handlebars');
const sequelize = require('./src/config/database');
const Dispositivo = require('./src/models/Dispositivo');
const ProgressoCacaPalavras = require('./src/models/ProgressoCacaPalavras');
const ProgressoVerdadeiroFalso = require('./src/models/ProgressoVerdadeiroFalso');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));

setupHandlebars(app);

sequelize.sync({ alter: true })
  .then(() => console.log('Tabelas sincronizadas com sucesso.'))
  .catch(err => console.error('Erro ao sincronizar tabelas:', err));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
