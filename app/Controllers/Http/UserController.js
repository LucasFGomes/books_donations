'use strict'

const User = use('App/Models/User');
const Donation = use('App/Models/Donation');

const StateController = use('App/Controllers/Http/StateController');
const CityController = use('App/Controllers/Http/CityController');

class UserController {
  async index({ params }) {
    const { id } = params;

    const user = await User.query().where('id', id).select('id', 'name', 'email', 'credits', 'points').first();

    return user;
  }

  async register({ request }) {

    const data = request.only(['name', 'username', 'email', 'password', 'credits', 'points']);
    const { state: state_name, city: city_name } = request.only(['state', 'city']);

    const state = await new StateController().show(state_name);
    const city = await new CityController().show(city_name, state.id);

    const user = await User.create({ ...data, city_id: city.id });

    return user;
  }

  async auth({ request, auth }) {

    const { email, password } = request.all();

    const token = await auth.attempt(email, password);
    let user = await User.query().where('email', email).select('id', 'name', 'credits').first()

    return { token, user }; 
  }

  async increaseCredit({ request, response, params }) {

    const { credit } = request.only(['credit']);
    const { id } = params;

    return await User.query().where('id', id).update({ credits: credit });
  }

  async giveNote({ request, response, params }) {

    const { note, donationId, ratedUserId, donor } = request.only(['note', 'donationId', 'ratedUserId', 'donor']);

    if (donor) {
      await Donation.query().where('id', donationId).update({ donor_evaluation: true, donor_note: note });
    } else {
      await Donation.query().where('id', donationId).update({ receiver_evaluation: true, receiver_note: note });
    }

    const { sum_notes, count_note } = await User.query().where('id', ratedUserId).select('sum_notes', 'count_note').first();
    const newSumNotes = (sum_notes + note);
    const newPoints = newSumNotes / (count_note + 1) 

    const numRowUpdated = await User.query().where('id', ratedUserId).update({ points: newPoints.toFixed(2), sum_notes: newSumNotes, count_note: count_note + 1})

    if (numRowUpdated <= 0) response.json({ error: "Erro ao dar a nota. " });

    return response.status(200).json({ message: "Avaliação cadastrada com sucesso." });
  }
}

module.exports = UserController
