'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Donation extends Model {

  book() {
    return this.hasOne("App/Models/Book", "book_id", "id");
  }

  receiver() {
    return this.hasOne("App/Models/User", "receiver_id", "id");
  }

}

module.exports = Donation
