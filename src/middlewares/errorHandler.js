function notFound(req, res, next) {
  res.status(404).json({ error: 'Rota não encontrada' });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
}

module.exports = { notFound, errorHandler };
