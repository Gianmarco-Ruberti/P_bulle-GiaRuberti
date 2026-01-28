import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'decks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('Title').notNullable().unique()
      table.string('Description').notNullable()
      table.integer('cardsCount').notNullable().unsigned()
      table
        .integer('User_id')
        .unsigned()
        .references('id')
        .inTable('cards')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
