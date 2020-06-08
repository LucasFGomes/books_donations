"use strict";

const Book = use("App/Models/Book");
const User = use("App/Models/User");
const Picture = use("App/Models/Picture");

class BookController {
  async index({ response, params }) {
    const { donor_id } = params;

    const user = await User.find(donor_id);
    if (!user) response.status(400).json({ error: "Usuário não encontrado." });

    const books = Book.query()
      .innerJoin("users", "users.id", "books.donor_id")
      .innerJoin("pictures", "books.id", "pictures.book_id")
      .innerJoin("cities", "cities.id", "users.city_id")
      .innerJoin("states", "states.id", "cities.state_id")
      .where({ has_interest: false, donated: false })
      .whereNotIn("donor_id", [donor_id])
      .select(
        "books.*",
        "pictures.url AS picture_book",
        "users.name AS user_name",
        "users.username",
        "users.email",
        "users.credits AS user_credits",
        "users.points",
        "users.phone",
        "cities.id AS city_id",
        "cities.name AS city_name",
        "states.id AS state_id",
        "states.name AS state_name"
      )
      .fetch();

    return books;
  }

  async recentRegisterBooks({ request, response }) {
    const books = await Book.query()
      .where({ has_interest: false, donated: false })
      .select(
        "books.id",
        "books.title",
        "books.author",
        "books.created_at"
      )
      .orderByRaw("books.created_at DESC")
      .limit(5)
      .fetch();

    return books;
  }

  async store({ request, response, params }) {
    const { title, author, resume, year, credit, url } = request.all();

    const { donor_id } = params;

    if (!donor_id)
      response
        .status(400)
        .json({ error: "Precisa ter um usuário para fazer uma doação." });

    const user = await User.find(donor_id);
    if (!user) response.status(400).json({ error: "Usuário não encontrado." });

    const book = await Book.create({
      title,
      author,
      resume,
      year,
      credit,
      donor_id,
    });

    if (url != "" && url.length > 0) {
      url.forEach(
        async (value) => await Picture.create({ url: value, book_id: book.id })
      );
    }

    return book;
  }

  async registerInterest({ request, response, params }) {
    const { book_id } = params;

    const book = await Book.find(book_id);
    if (!book)
      response.status(400).json({ error: "Livro não foi encontrado." });

    const book_updated = await Book.query()
      .where("id", "=", book_id)
      .update({ has_interest: !book.has_interest });

    if (book_updated <= 0)
      response.json({ error: "Erro ao atualizar o campo. " });

    return response
      .status(200)
      .json({ message: "Campo atualizado com sucesso. " });
  }

  async registerDonation({ request, response, params }) {
    const { book_id } = params;

    const book = await Book.find(book_id);
    if (!book)
      response.status(400).json({ error: "Livro não foi encontrado." });

    const book_updated = await Book.query()
      .where("id", "=", book_id)
      .update({ donated: true });

    if (book_updated <= 0)
      response.json({ error: "Erro ao atualizar o campo. " });

    return response
      .status(200)
      .json({ message: "Campo atualizado com sucesso. " });
  }
}

module.exports = BookController;
