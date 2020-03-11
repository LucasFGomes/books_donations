'use strict'

class HomeController {
  async index() {
    return { message: 'Hello world' };
  }
}

module.exports = HomeController
