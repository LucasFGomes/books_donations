'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookSchema extends Schema {
  up() {
    this.create('books', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.string('author').notNullable()
      table.string('resume').notNullable()
      table.integer('year')
      table.float('credit')
        .unsigned()
        .notNullable()
        .defaultTo(0.0)
      table.integer('donor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down() {
    this.drop('books')
  }
}

module.exports = BookSchema
