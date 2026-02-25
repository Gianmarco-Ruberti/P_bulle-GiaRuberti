import { HttpContext } from '@adonisjs/core/http'

import Card from '../models/card.js'
import vine from '@vinejs/vine'
import { dd } from '@adonisjs/core/services/dumper'

export default class CardsController {
  async show({ params, view }: HttpContext) {
    const card = await Card.query().where('id', params.id).firstOrFail() // Renvoie une erreur 404 si l'ID n'existe pas

    return view.render('pages/cards/show', { card })
  }
  async create({ view, request }: HttpContext) {
    const deckId = request.input('deckId')
    return view.render('pages/cards/create', { deckId })
  }
  // Enregistre les données
  async store({ request, response, session }: HttpContext) {
    // 1. Définir les règles de validation
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          question: vine
            .string()
            .trim()
            .unique({ table: 'cards', column: 'question' })
            .minLength(10),
          answer: vine.string().trim(),
          deckId: vine.number().exists({ table: 'decks', column: 'id' }),
        })
      )
    )
    // 2. Création de la card
    await Card.create(payload)

    // 3. Notification de succès et redirection
    session.flash('notification', {
      type: 'success',
      message: 'La carte a été créé avec succès !',
    })
    return response.redirect().toPath('/')
  }
  async edit({ params, view }: HttpContext) {
    const card = await Card.findOrFail(params.id)
    return view.render('pages/Cards/edit', { card })
  }
  async update({ params, response, session }: HttpContext) {
    // 1. On récupère le card existant grâce à l'ID passé dans l'URL (/cards/:id)
    // Si l'ID n'existe pas, Adonis s'arrête ici et renvoie une erreur 404.
    const card = await Card.findOrFail(params.id)

    // 4. On stocke un message temporaire pour l'afficher sur la page suivante
    session.flash('notification', 'card mis à jour !')

    // 5. Redirection vers la page de détails du card que l'on vient de modifier
    return response.redirect().toPath(`/cards/${card.id}`)
  }
  async destroy({ params, response, session }: HttpContext) {
    try {
      // 1. Trouver le card par son ID
      const card = await Card.findOrFail(params.id)

      // 2. Supprimer
      // (Si tu as configuré les onDelete: 'cascade' en BDD, les cartes suivront)
      await card.delete()

      // 3. Ajouter un message flash de succès
      session.flash('notification', {
        type: 'success',
        message: 'Le card a été supprimé avec succès.',
      })

      // 4. Rediriger vers la liste
      return response.redirect('/')
    } catch (error) {
      // Cas où le card n'existe pas ou erreur SQL
      session.flash('notification', {
        type: 'error',
        message: 'Impossible de supprimer ce card.',
      })
      return response.redirect().back()
    }
  }
}
