'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DonationSchema extends Schema {
  up() {
    this.create('donations', (table) => {
      table.increments()
      table.string('address').notNullable()
      table.string('status').defaultTo('processing')
      table.date('date_delivery').notNullable()
      table.integer('book_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('books')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('receiver_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down() {
    this.drop('donations')
  }
}

module.exports = DonationSchema
