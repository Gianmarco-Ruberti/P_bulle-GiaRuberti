import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DeckFactory } from '../factories/deck_factory.js'

export default class extends BaseSeeder {
  async run() {
    await DeckFactory.createMany(10)
  }
}
