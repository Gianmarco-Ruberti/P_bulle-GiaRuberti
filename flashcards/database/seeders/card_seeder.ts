import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CardFactory } from '../factories/card_factory.js'

export default class extends BaseSeeder {
  async run() {
    await CardFactory.createMany(100)
  }
}
