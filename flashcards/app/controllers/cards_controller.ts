import { HttpContext } from '@adonisjs/core/http'
import Card from '../models/card.js'
import { dd } from '@adonisjs/core/services/dumper'
import { createCardValidator, updateCardValidator } from '#validators/card'

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
    const payload = await request.validateUsing(createCardValidator)

    await Card.create(payload)

    session.flash('notification', {
      type: 'success',
      message: 'La carte a été créée avec succès !',
    })
    return response.redirect().toPath('/')
  }
  async edit({ params, view }: HttpContext) {
    const card = await Card.findOrFail(params.id)
    return view.render('pages/Cards/edit', { card })
  }
  // Mettre à jour une carte existante
  async update({ params, request, response, session }: HttpContext) {
    const card = await Card.findOrFail(params.id)

    // On passe l'ID actuel au validateur pour l'exception d'unicité
    const payload = await request.validateUsing(updateCardValidator(card.id, card.deckId))

    await card.merge(payload).save()

    session.flash('notification', 'Carte mise à jour !')

    // Utilise le chemin exact de ta route (attention au singulier/pluriel)
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
