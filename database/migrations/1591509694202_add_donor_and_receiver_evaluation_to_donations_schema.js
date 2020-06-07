'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDonorAndReceiverEvaluationToDonationsSchema extends Schema {
  up () {
    this.table('donations', (table) => {
      table.boolean('donor_evaluation').defaultTo(false);
      table.boolean('receiver_evaluation').defaultTo(false);
    })
  }

  down () {
    this.table('donations', (table) => {
      table.dropColumn('donor_evaluation');
      table.dropColumn('receiver_evaluation');
    })
  }
}

module.exports = AddDonorAndReceiverEvaluationToDonationsSchema
