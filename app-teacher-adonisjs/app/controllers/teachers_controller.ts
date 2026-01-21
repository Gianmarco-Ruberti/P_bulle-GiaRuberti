import type { HttpContext } from '@adonisjs/core/http'
// import { dd } from '@adonisjs/core/services/dumper'
import Teacher from '../models/teacher.js'
import { teacherValidator } from '../validators/teacher.js'
import Section from '../models/section.js'

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
  async create({ view }: HttpContext) {
    // Récupération des sections triées par le nom
    const sections = await Section.query().orderBy('name', 'asc')
    // Appel de la vue
    return view.render('pages/teachers/create', { title: "Ajout d'un enseignant", sections })
  }
  /**
   * Handle form submission for the create action
   */
  async store({ request, session, response }: HttpContext) {
    // Validation des données saisies par l'utilisateur
    const { gender, firstname, lastname, nickname, origine, sectionId } =
      await request.validateUsing(teacherValidator)
    // Création du nouvel enseignant
    const teacher = await Teacher.create({
      gender,
      firstname,
      lastname,
      nickname,
      origine,
      sectionId,
    })
    // Afficher un message à l'utilisateur
    session.flash(
      'success',
      `Le nouvel enseignant ${teacher.lastname}
${teacher.firstname} a été ajouté avec succès !`
    )
    // Rediriger vers la homepage
    return response.redirect().toRoute('home')
  }
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
  async edit({ params, view }: HttpContext) {
    // Sélectionner l'enseignant dont on veut mettre à jour des informations
    const teacher = await Teacher.findOrFail(params.id)
    // Récupération des sections triées par le nom
    const sections = await Section.query().orderBy('name', 'asc')
    // Afficher la vue
    return view.render('pages/teachers/edit.edge', {
      title: 'Modifier un enseignant',
      teacher,
      sections,
    })
  }
  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, session, response }: HttpContext) {
    // Validation des données saisies par l'utilisateur
    const { gender, firstname, lastname, nickname, origine, sectionId } =
      await request.validateUsing(teacherValidator)
    // Sélectionner l'enseignant dont on veut mettre à jour des informations
    const teacher = await Teacher.findOrFail(params.id)
    // Met à jour les infos de l'enseignant
    teacher.merge({
      gender,
      firstname,
      lastname,
      nickname,
      origine,
      sectionId,
    })
    const teacherUpdated = await teacher.save()
    // Afficher un message à l'utilisateur
    session.flash(
      'success',
      `L'enseignant ${teacherUpdated.lastname} ${teacherUpdated.firstname} a été mis à jour avec succès !`
    )
    // Redirige l'utilisateur sur la home
    return response.redirect().toRoute('home')
  }
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
