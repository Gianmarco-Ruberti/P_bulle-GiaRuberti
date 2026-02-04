import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('question').notNullable().unique()
      table.string('answer').notNullable()
      table
        .integer('Deck_id')
        .unsigned()
        .references('id')
        .inTable('decks')
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
