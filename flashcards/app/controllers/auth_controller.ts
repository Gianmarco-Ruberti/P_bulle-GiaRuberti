import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async index({ view }: HttpContext) {
    /**
     * .query() : On démarre une requête SQL
     * .withCount('cards') : On demande à SQL de compter les lignes liées dans la table 'cards'
     * Cela génère une sous-requête : (SELECT count(*) FROM cards WHERE deck_id = decks.id)
     */
    const decks = await Deck.query().withCount('cards')
    return view.render('pages/home', { decks })
  }
}
