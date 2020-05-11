'use strict'

const State = use('App/Models/State');

class StateController {
  async show(state) {

    const stateFound = await State.query().where('name', state).fetch();

    if (!stateFound.toJSON().length > 0) {
      return this.store(state);
    }

    return stateFound.toJSON()[0];
  }

  async store(state) {
    return await State.create({ name: state });
  }
}

module.exports = StateController
