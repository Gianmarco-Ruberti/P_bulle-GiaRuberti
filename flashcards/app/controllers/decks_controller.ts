import Deck from '#models/deck'
import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

export default class DecksController {
  async index({ params, view }: HttpContext) {
    // On récupère l'ID depuis l'URL (ex: /decks/5)
    // On utilise .preload('cards') pour charger les cartes liées au deck
    const deck = await Deck.query().where('id', params.id).preload('cards').firstOrFail() // Renvoie une erreur 404 si l'ID n'existe pas

    return view.render('pages/decks/show', { deck })
  }
  // Affiche le formulaire
  async create({ view }: HttpContext) {
    return view.render('pages/decks/create')
  }

  // Enregistre les données
  async store({ request, response, session }: HttpContext) {
    // 1. Définir les règles de validation (Analyse p.7)
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          title: vine.string().trim().unique({ table: 'decks', column: 'title' }),
          description: vine.string().trim().minLength(10),
        })
      )
    )

    // 2. Création du deck en base de données
    await Deck.create(payload)

    // 3. Notification de succès et redirection
    session.flash('notification', 'Le deck a été créé avec succès !')
    return response.redirect().toPath('/')
  }
  // Ajoute cette méthode dans ton DecksController
  async show({ params, view }: HttpContext) {
    try {
      // 1. On cherche le deck par son ID
      // 2. On charge les cartes associées (Eager Loading)
      const deck = await Deck.query().where('id', params.id).preload('cards').firstOrFail()

      return view.render('pages/decks/show', { deck })
    } catch (error) {
      // Si l'ID n'existe pas, firstOrFail jette une erreur
      return view.render('errors/not_found')
    }
  }
}
