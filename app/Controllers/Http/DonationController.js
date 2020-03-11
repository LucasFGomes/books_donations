'use strict'

const Book = use('App/Models/Book');
const User = use('App/Models/User');
const Donation = use('App/Models/Donation');

class DonationController {

  async index({ response }) {

    const donations = await Donation
      .query()
      .with('book')
      .with('receiver')
      .fetch();

    const total_completed = await this.total_donations_completed();
    const total_pending = await this.total_donations_pending();

    return response.json({ donations, total_completed, total_pending });
  }

  async show({ response, params }) {

    const { donor_id } = params;

    const donor = await User.find(donor_id);
    if (!donor) response.status(400).json({ error: 'Usuário não encontrado.' });


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

    const user_donations = await User
      .query()
      .innerJoin('books', 'users.id', 'books.donor_id')
      .innerJoin('donations', 'books.id', 'donations.book_id')
      .innerJoin('users as user_receiver', 'user_receiver.id', 'donations.receiver_id')
      .where('users.id', donor_id)
      .select(
        'donations.id',
        'donations.status',
        'donations.address',
        'donations.date_delivery',
        'books.title AS book_title',
        'users.name AS name_donor',
        'user_receiver.name AS name_receiver',
        'donations.created_at',
        'donations.updated_at'
      )
      .fetch();

    return response.json({ user_donations, total_completed, total_pending });

  }

  async store({ request, response }) {

    const data = request.all();
    const { receiver_id } = data;

    if (!receiver_id) response.status(400).json({ error: "É necessário ter um recebedor, para realizar a doação." });

    const receiver = await User.find(receiver_id);
    if (!receiver) response.status(400).json({ error: 'Recebedor não encontrado.' });

    const donation = await Donation.create(data);

    return donation;

  }

  async total_donations_completed() {
    const count = await Donation
      .query()
      .with('book')
      .with('receiver')
      .where({ 'donations.status': 'completed' })
      .count('* as total');

    return parseInt(count[0].total);
  }

  async total_donations_pending() {
    const count = await Donation
      .query()
      .with('book')
      .with('receiver')
      .where({ 'donations.status': 'processing' })
      .count('* as total');

    return parseInt(count[0].total);
  }

  async total_user_donations_completed(donor_id) {
    const count = await User
      .query()
      .innerJoin('books', 'users.id', 'books.donor_id')
      .innerJoin('donations', 'books.id', 'donations.book_id')
      .where({ 'users.id': donor_id, 'donations.status': 'completed' })
      .count('* as total');

    return parseInt(count[0].total);
  }

  async total_user_donations_pending(donor_id) {
    const count = await User
      .query()
      .innerJoin('books', 'users.id', 'books.donor_id')
      .innerJoin('donations', 'books.id', 'donations.book_id')
      .where({ 'users.id': donor_id, 'donations.status': 'processing' })
      .count('* as total');

    return parseInt(count[0].total);
  }

}

module.exports = DonationController
