const { supabase } = require('../config/supabase');

const TABLE_NAME = 'books';

function isValidBookPayload(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (!payload.title || !payload.author) return false;
  return true;
}

async function listBooks(req, res, next) {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getBookById(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      throw error;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function createBook(req, res, next) {
  try {
    const payload = req.body;

    if (!isValidBookPayload(payload)) {
      return res.status(400).json({ error: 'Título e autor são obrigatórios.' });
    }

    const bookToInsert = {
      title: payload.title.trim(),
      author: payload.author.trim(),
      category: payload.category?.trim() || null,
      year: payload.year ? Number(payload.year) : null,
      description: payload.description?.trim() || null,
      status: payload.status || 'Disponível'
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(bookToInsert)
      .select('*')
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!isValidBookPayload(payload)) {
      return res.status(400).json({ error: 'Título e autor são obrigatórios.' });
    }

    const bookToUpdate = {
      title: payload.title.trim(),
      author: payload.author.trim(),
      category: payload.category?.trim() || null,
      year: payload.year ? Number(payload.year) : null,
      description: payload.description?.trim() || null,
      status: payload.status || 'Disponível',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(bookToUpdate)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      throw error;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      throw error;
    }

    res.json({ message: 'Livro removido com sucesso', deleted: data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
