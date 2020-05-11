'use strict'

const City = use('App/Models/City');

class CityController {
  async show(city, state_id) {

    const cityFound = await City.query().where('name', city).fetch();

    if (!cityFound.toJSON().length > 0) {
      return this.store(city, state_id);
    }

    return cityFound.toJSON()[0];
  }

  async store(city, state_id) {
    return await City.create({ name: city, state_id });
  }
}

module.exports = CityController
