import type { HttpContext } from '@adonisjs/core/http'
import Section from '../models/section.js'
import { sectionValidator } from '../validators/section.js'

export default class SectionsController {
  async show({ view }: HttpContext) {
    const sections = await Section.query().orderBy('name', 'asc')
    // Afficher la vue
    return view.render('pages/sections/show.edge', { title: 'Liste des sections', sections })
  }
  async create({ view }: HttpContext) {
    // Récupération des sections triées par le nom
    const sections = await Section.query().orderBy('name', 'asc')
    // Appel de la vue
    return view.render('pages/sections/create', { title: "Ajout d'une section", sections })
  }
  async store({ request, session, response }: HttpContext) {
    // Validation des données saisies par l'utilisateur
    const { name } = await request.validateUsing(sectionValidator)
    // Création de la nouvelle section
    const section = await Section.create({
      name,
    })
    session.flash('success', `La nouvelle section ${section.name} a été ajouté avec succès !`)
    // Rediriger vers les section
    return response.redirect().toRoute('section.show')
  }
  async destroy({ params, session, response }: HttpContext) {
    // Sélectionne l'enseignant à supprimer
    const section = await Section.findOrFail(params.id)
    // Supprime l'enseignant
    await section.delete()
    // Afficher un message à l'utilisateur
    session.flash('success', `La section ${section.name} a été supprimé avec succès !`)
    // Redirige l'utilisateur sur la home
    return response.redirect().toRoute('home')
  }
}
