import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CardFactory } from '../factories/card_factory.js'
import Deck from '../../app/models/deck.js'

export default class extends BaseSeeder {
  async run() {
    const deck = await Deck.first()
    if (!deck) {
      console.log("Aucun deck trouvé. Lancez d'abord le DeckSeeder !")
      return
    }
    await CardFactory.merge({ deckId: deck.id }).createMany(100)
  }
}
