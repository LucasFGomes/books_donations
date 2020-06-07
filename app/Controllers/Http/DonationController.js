"use strict";

const Book = use("App/Models/Book");
const User = use("App/Models/User");
const Donation = use("App/Models/Donation");

class DonationController {
  async index({ response }) {
    const donations = await Donation.query()
      .with("book")
      .with("receiver")
      .whereNot("status", "canceled")
      .fetch();

    const total_completed = await this.total_donations_completed();
    const total_pending = await this.total_donations_pending();

    return response.json({ donations, total_completed, total_pending });
  }

  async show({ response, params }) {
    const { donor_id } = params;

    const donor = await User.find(donor_id);
    if (!donor) response.status(400).json({ error: "Usuário não encontrado." });

    const total_pending = await this.total_user_donations_pending(donor_id);

    // const user_donations_pending = await User
    //   .query()
    //   .innerJoin('books', 'users.id', 'books.donor_id')
    //   .innerJoin('donations', 'books.id', 'donations.book_id')
    //   .where({ 'users.id': donor_id, 'donations.status': 'processing' })
    //   .select(
    //     'donations.id',
    //     'donations.status',
    //     'donations.address',
    //     'donations.date_delivery',
    //     'donations.created_at',
    //     'donations.updated_at'
    //   )
    //   .fetch();

    const total_completed = await this.total_user_donations_completed(donor_id);
    const total_received_pending = await this.total_donations_received_user_pending(
      donor_id
    );
    const total_received_completed = await this.total_donations_received_user_completed(
      donor_id
    );

    const user_donations = await User.query()
      .innerJoin("books", "users.id", "books.donor_id")
      .innerJoin("donations", "books.id", "donations.book_id")
      .innerJoin(
        "users as user_receiver",
        "user_receiver.id",
        "donations.receiver_id"
      )
      .where("users.id", donor_id)
      .whereNot("donations.status", "canceled")
      .select(
        "donations.id AS donation_id",
        "donations.status",
        "donations.date_delivery",
        "donations.receiver_id",
        "donations.donor_evaluation",
        "donations.receiver_evaluation",
        "books.id AS book_id",
        "books.credit",
        "books.title AS book_title",
        "books.donor_id",
        "users.name AS name_donor",
        "user_receiver.name AS name_receiver",
        "donations.created_at",
        "donations.updated_at"
      )
      .fetch();

    const user_receipts = await User.query()
      .innerJoin("books", "users.id", "books.donor_id")
      .innerJoin("donations", "books.id", "donations.book_id")
      .innerJoin(
        "users as user_receiver",
        "user_receiver.id",
        "donations.receiver_id"
      )
      .where("donations.receiver_id", donor_id)
      .whereNot("donations.status", "canceled")
      .select(
        "donations.id AS donation_id",
        "donations.status",
        "donations.date_delivery",
        "donations.receiver_id",
        "donations.donor_evaluation",
        "donations.receiver_evaluation",
        "books.id AS book_id",
        "books.credit",
        "books.title AS book_title",
        "books.donor_id",
        "users.name AS name_donor",
        "user_receiver.name AS name_receiver",
        "donations.created_at",
        "donations.updated_at"
      )
      .fetch();

    return response.json({
      user_donations,
      user_receipts,
      total_completed,
      total_pending,
      total_received_pending,
      total_received_completed,
    });
  }

  async store({ request, response }) {
    const data = request.all();
    const { receiver_id } = data;

    if (!receiver_id)
      response
        .status(400)
        .json({
          error: "É necessário ter um recebedor, para realizar a doação.",
        });

    const receiver = await User.find(receiver_id);
    if (!receiver)
      response.status(400).json({ error: "Recebedor não encontrado." });

    const donation = await Donation.create(data);

    return donation;
  }

  async cancelDonation({ request, response, params }) {
    const { donation_id } = params;

    const numRowUpdated = await Donation.query()
      .where("id", donation_id)
      .update({ status: "canceled" });

    if (numRowUpdated == 1) {
      return response
        .status(200)
        .json({ message: "Doação cancelada com sucesso." });
    } else {
      return response.status(404).json({ error: "Doação não existe." });
    }
  }

  async completeDonation({ request, response, params }) {
    const { donation_id, donor_id } = params;
    const { receiver_id, book_id, credit } = request.only([
      "receiver_id",
      "book_id",
      "credit",
    ]);

    try {
      const numRowUpdated = await Donation.query()
        .where("id", donation_id)
        .update({ status: "completed" });

      if (numRowUpdated == 1) {
        const donorFound = await User.query().where("id", donor_id).first();
        const receiverFound = await User.query()
          .where("id", receiver_id)
          .first();

        await User.query()
          .where("id", donorFound.id)
          .update({ credits: donorFound.credits + credit });
        await User.query()
          .where("id", receiverFound.id)
          .update({ credits: receiverFound.credits - credit });

        return response
          .status(200)
          .json({ message: "Doação concluida com sucesso. " });
      } else {
        return response.json({ error: "Não foi possível concluir a doação." });
      }
    } catch (err) {
      console.log("Error: ", err);
      return response.json({ error: err });
    }
  }

  async total_donations_completed() {
    const count = await Donation.query()
      .with("book")
      .with("receiver")
      .where({ "donations.status": "completed" })
      .count("* as total");

    return parseInt(count[0].total);
  }

  async total_donations_pending() {
    const count = await Donation.query()
      .with("book")
      .with("receiver")
      .where({ "donations.status": "processing" })
      .count("* as total");

    return parseInt(count[0].total);
  }

  async total_user_donations_completed(donor_id) {
    const count = await User.query()
      .innerJoin("books", "users.id", "books.donor_id")
      .innerJoin("donations", "books.id", "donations.book_id")
      .where({ "users.id": donor_id, "donations.status": "completed" })
      .count("* as total");

    return parseInt(count[0].total);
  }

  async total_user_donations_pending(donor_id) {
    const count = await User.query()
      .innerJoin("books", "users.id", "books.donor_id")
      .innerJoin("donations", "books.id", "donations.book_id")
      .where({ "users.id": donor_id, "donations.status": "processing" })
      .count("* as total");

    return parseInt(count[0].total);
  }

  async total_donations_received_user_pending(donor_id) {
    const count = await User.query()
      .innerJoin("books", "users.id", "books.donor_id")
      .innerJoin("donations", "books.id", "donations.book_id")
      .where({
        "donations.receiver_id": donor_id,
        "donations.status": "processing",
      })
      .count("* as total");

    return parseInt(count[0].total);
  }

  async total_donations_received_user_completed(donor_id) {
    const count = await User.query()
      .innerJoin("books", "users.id", "books.donor_id")
      .innerJoin("donations", "books.id", "donations.book_id")
      .where({
        "donations.receiver_id": donor_id,
        "donations.status": "completed",
      })
      .count("* as total");

    return parseInt(count[0].total);
  }
}

module.exports = DonationController;
