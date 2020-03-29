'use strict'

const Book = use('App/Models/Book');
const User = use('App/Models/User');

class BookController {

  async index({ response, params }) {

    const { donor_id } = params;

    const user = await User.find(donor_id);
    if (!user) response.status(400).json({ error: 'Usuário não encontrado.' });

    const books = Book
      .query()
      .with('user')
      .where({ has_interest: false, donated: false })
      .whereNotIn("donor_id", [donor_id])
      .fetch();

    return books;

  }

  async store({ request, response, params }) {

    const data = request.all();
    const { donor_id } = params;

    if (!donor_id) response.status(400).json({ error: "Precisa ter um usuário para fazer uma doação." });

    const user = await User.find(donor_id);
    if (!user) response.status(400).json({ error: 'Usuário não encontrado.' });

    const book = await Book.create({ ...data, donor_id });

    return book;

  }

  async registerInterest({ request, response, params }) {

    const { book_id } = params;

    const book = await Book.find(book_id);
    if (!book) response.status(400).json({ error: "Livro não foi encontrado." });

    const book_updated = await Book.query().where('id', '=', book_id).update({ has_interest: !book.has_interest });

    if (book_updated <= 0) response.json({ error: 'Erro ao atualizar o campo. ' });

    return response.status(200).json({ message: 'Campo atualizado com sucesso. ' });
  }

  async registerDonation({ request, response, params }) {

    const { book_id } = params;

    const book = await Book.find(book_id);
    if (!book) response.status(400).json({ error: "Livro não foi encontrado." });

    const book_updated = await Book.query().where('id', '=', book_id).update({ donated: true });

    if (book_updated <= 0) response.json({ error: 'Erro ao atualizar o campo. ' });

    return response.status(200).json({ message: 'Campo atualizado com sucesso. ' });
  }

}

module.exports = BookController
