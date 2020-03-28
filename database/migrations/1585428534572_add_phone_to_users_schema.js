'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddPhoneToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('phone')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('phone');
    })
  }
}

module.exports = AddPhoneToUsersSchema
