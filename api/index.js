const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const booksRoutes = require('../src/routes/booksRoutes');
const { notFound, errorHandler } = require('../src/middlewares/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerPath = path.join(process.cwd(), 'api/swagger/openapi.yaml');
const swaggerDocument = YAML.load(swaggerPath);

const swaggerHtml = swaggerUi.generateHTML(swaggerDocument);

app.use('/docs', swaggerUi.serve);
app.get('/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(swaggerHtml);
});

app.get('/', (req, res) => {
  res.json({
    message: 'API Biblioteca Virtual funcionando',
    endpoints: ['/books'],
    docs: '/docs'
  });
});

app.use('/books', booksRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/docs`);
  });
}

module.exports = app;