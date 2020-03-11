'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Book extends Model {
  user() {
    return this.belongsTo("App/Models/User", "donor_id", "id");
  }

  donation() {
    return this.belongsTo("App/Models/Donation");
  }
}

module.exports = Book
