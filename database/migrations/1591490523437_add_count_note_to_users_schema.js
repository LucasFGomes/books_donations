'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCountNoteToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('count_note');
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('count_note');
    })
  }
}

module.exports = AddCountNoteToUsersSchema
