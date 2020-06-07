'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddNoteDonorAndReceiverToDonationsSchema extends Schema {
  up () {
    this.table('donations', (table) => {
      table.integer('donor_note');
      table.integer('receiver_note');
    })
  }

  down () {
    this.table('donations', (table) => {
      table.dropColumn('donor_note');
      table.dropColumn('receiver_note');
    })
  }
}

module.exports = AddNoteDonorAndReceiverToDonationsSchema
