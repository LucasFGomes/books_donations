'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PictureSchema extends Schema {
  up () {
    this.create('pictures', (table) => {
      table.increments()
      table.string('url')
      table.integer('book_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('books')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('pictures')
  }
}

module.exports = PictureSchema
