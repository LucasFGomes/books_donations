'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCityIdToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('city_id')
        .unsigned()
        .references('id')
        .inTable('cities')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('city_id');
    })
  }
}

module.exports = AddCityIdToUsersSchema
