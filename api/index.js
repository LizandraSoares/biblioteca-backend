const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const YAML = require('yamljs');

const booksRoutes = require('../src/routes/booksRoutes');
const { notFound, errorHandler } = require('../src/middlewares/errorHandler');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const swaggerDocument = YAML.load(
  path.join(__dirname, 'swagger/openapi.yaml')
);

app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});


app.get('/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Swagger UI</title>

      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
      />

      <style>
        body {
          margin: 0;
          background: #fafafa;
        }

        #swagger-ui {
          max-width: 100%;
        }
      </style>
    </head>

    <body>
      <div id="swagger-ui"></div>

      <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>

      <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>

      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/swagger.json',
            dom_id: '#swagger-ui',

            deepLinking: true,

            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],

            layout: 'BaseLayout'
          });
        };
      </script>
    </body>
    </html>
  `);
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