import { HttpContext } from '@adonisjs/core/http'

import Card from '../models/card.js'

export default class CardsController {
  async show({ params, view }: HttpContext) {
    // On utilise .preload('cards') pour charger les cartes liées au deck
    const card = await Card.query().where('id', params.id).firstOrFail() // Renvoie une erreur 404 si l'ID n'existe pas

    return view.render('pages/cards/show', { card })
  }
  async destroy({ params, response, session }: HttpContext) {
    try {
      // 1. Trouver le deck par son ID
      const card = await Card.findOrFail(params.id)

      // 2. Supprimer le deck
      // (Si tu as configuré les onDelete: 'cascade' en BDD, les cartes suivront)
      await card.delete()

      // 3. Ajouter un message flash de succès
      session.flash('notification', {
        type: 'success',
        message: 'Le deck a été supprimé avec succès.',
      })

      // 4. Rediriger vers la liste des decks
      return response.redirect('/')
    } catch (error) {
      // Cas où le deck n'existe pas ou erreur SQL
      session.flash('notification', {
        type: 'error',
        message: 'Impossible de supprimer ce deck.',
      })
      return response.redirect().back()
    }
  }
}
