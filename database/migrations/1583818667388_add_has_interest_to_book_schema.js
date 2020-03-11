'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddHasInterestToBookSchema extends Schema {
  up() {
    this.table('books', (table) => {
      table.boolean('has_interest').defaultTo(false)
    })
  }

  down() {
    this.table('books', (table) => {
      table.dropColumn('has_interest');
    })
  }
}

module.exports = AddHasInterestToBookSchema
