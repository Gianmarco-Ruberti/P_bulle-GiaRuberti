import type { HttpContext } from '@adonisjs/core/http'
// import { dd } from '@adonisjs/core/services/dumper'
import Teacher from '../models/teacher.js'

export default class TeachersController {
  /**
   * Afficher la liste des enseignants
   */
  async index({ view }: HttpContext) {
    //
    // Récupérer la liste des enseignants triés par ordre alphabétique sur le nom et le prénom
    const teachers = await Teacher.query().orderBy('lastname', 'asc').orderBy('firstname', 'asc')
    // Pour obtenir des infos sur la variable teachers
    // dd(teachers)
    // Appel de la vue
    return view.render('pages/home', { teachers })
  }
  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}
  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}
  /**
   * Afficher les détails d'un enseignant (y compris le nom de sa section)
   */
  async show({ params, view }: HttpContext) {
    // Sélectionner l'enseignant dont on veut afficher les détails
    const teacher = await Teacher.query().where('id', params.id).preload('section').firstOrFail()
    // Afficher la vue
    return view.render('pages/teachers/show.edge', { title: "Détail d'un enseignant", teacher })
  }
  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}
  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}
  /**
   * Supprimer un enseignant
   */
  async destroy({ params, session, response }: HttpContext) {
    // Sélectionne l'enseignant à supprimer
    const teacher = await Teacher.findOrFail(params.id)
    // Supprime l'enseignant
    await teacher.delete()
    // Afficher un message à l'utilisateur
    session.flash(
      'success',
      `L'enseignant ${teacher.lastname} ${teacher.firstname} a été supprimé avec
 succès !`
    )
    // Redirige l'utilisateur sur la home
    return response.redirect().toRoute('home')
  }
}
