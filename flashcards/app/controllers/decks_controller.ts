import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'
import { createDeckValidator, updateDeckValidator } from '#validators/deck'
import { frMessages } from '../validators/message.js'

export default class DecksController {
  async index({ view }: HttpContext) {
    const decks = await Deck.query().withCount('cards')
    return view.render('pages/home', { decks })
  }
  async show({ params, view }: HttpContext) {
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
    // Utilisation du validateur externe
    const payload = await request.validateUsing(createDeckValidator, {
      messagesProvider: frMessages,
    })

    await Deck.create(payload)

    session.flash('notification', {
      type: 'success',
      message: 'Le deck a été créé avec succès !',
    })
    return response.redirect().toPath('/')
  }

  // Afficher le formulaire d'édition
  async edit({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/decks/edit', { deck })
  }

  // Traiter la modification
  async update({ params, request, response, session }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    // Utilisation du validateur dynamique en passant l'ID actuel
    const payload = await request.validateUsing(updateDeckValidator(deck.id))

    await deck.merge(payload).save()

    session.flash('notification', 'Deck mis à jour !')
    return response.redirect().toPath(`/decks/${deck.id}`)
  }
  /**
   * Supprimer un deck et ses cartes
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      // 1. Trouver le deck par son ID
      const deck = await Deck.findOrFail(params.id)

      // 2. Supprimer le deck
      // (Si tu as configuré les onDelete: 'cascade' en BDD, les cartes suivront)
      await deck.delete()

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
