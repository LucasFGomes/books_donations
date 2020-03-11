'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDonatedToBookSchema extends Schema {
  up() {
    this.table('books', (table) => {
      table.boolean('donated').defaultTo(false)
    })
  }

  down() {
    this.table('books', (table) => {
      table.dropColumn('donated');
    })
  }
}

module.exports = AddDonatedToBookSchema
