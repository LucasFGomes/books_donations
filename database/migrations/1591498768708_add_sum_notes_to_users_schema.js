'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSumNotesToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('sum_notes');
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('sum_notes');
    })
  }
}

module.exports = AddSumNotesToUsersSchema
