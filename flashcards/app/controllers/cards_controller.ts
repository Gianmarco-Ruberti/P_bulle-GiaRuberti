import { HttpContext } from '@adonisjs/core/http'

import Card from '../models/card.js'

export default class CardsController {
  async show({ params, view }: HttpContext) {
    // On utilise .preload('cards') pour charger les cartes liées au deck
    const card = await Card.query().where('id', params.id).firstOrFail() // Renvoie une erreur 404 si l'ID n'existe pas

    return view.render('pages/cards/show', { card })
  }
}
