'use strict'

const User = use('App/Models/User');

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
}

module.exports = UserController
