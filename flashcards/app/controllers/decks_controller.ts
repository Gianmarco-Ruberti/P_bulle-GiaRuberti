import Deck from '#models/deck'
import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import { dd } from '@adonisjs/core/services/dumper'

export default class DecksController {
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
    // 1. Définir les règles de validation (Analyse p.7)
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          title: vine.string().trim().unique({ table: 'decks', column: 'title' }),
          description: vine.string().trim().minLength(10),
        })
      )
    )

    // 2. Création du deck
    await Deck.create(payload)

    // 3. Notification de succès et redirection
    session.flash('notification', 'Le deck a été créé avec succès !')
    return response.redirect().toPath('/')
  }

  // Afficher le formulaire d'édition
  async edit({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/decks/edit', { deck })
  }

  // Traiter la modification
  async update({ params, request, response, session }: HttpContext) {
    // 1. On récupère le deck existant grâce à l'ID passé dans l'URL (/decks/:id)
    // Si l'ID n'existe pas, Adonis s'arrête ici et renvoie une erreur 404.
    const deck = await Deck.findOrFail(params.id)

    // 2. Lancement de la validation des données envoyées par le formulaire
    const payload = await request.validateUsing(
      vine.compile(
        vine.object({
          /**
           * Règle unique avec filtre :
           * On veut que le titre soit unique, MAIS on doit ignorer le deck actuel.
           * Sinon, si tu modifies la description sans changer le titre,
           * Vine te dirait "Ce titre est déjà pris" (par toi-même !).
           */
          title: vine
            .string()
            .trim()
            .unique({
              table: 'decks', // Cherche dans la table 'decks'
              column: 'title', // Regarde la colonne 'title'
              filter: (db) => {
                // "Exclure celui qui a mon ID" de la vérification d'unicité
                db.whereNot('id', deck.id)
              },
            }),

          // La description doit faire au moins 10 caractères (Analyse p.7)
          description: vine.string().trim().minLength(10),
        })
      )
    )

    /**
     * 3. Mise à jour de l'objet
     * .merge(payload) : On écrase les anciennes valeurs par les nouvelles (celles validées)
     * .save() : On envoie la requête SQL "UPDATE" à la base de données
     */
    await deck.merge(payload).save()

    // 4. On stocke un message temporaire pour l'afficher sur la page suivante
    session.flash('notification', 'Deck mis à jour !')

    // 5. Redirection vers la page de détails du deck que l'on vient de modifier
    return response.redirect().toPath(`/decks/${deck.id}`)
  }
}
