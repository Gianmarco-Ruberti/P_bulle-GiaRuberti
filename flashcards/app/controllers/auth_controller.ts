import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const data = request.all()
    console.log(` username fourni: ${data.username}`)

    try {
      // 1. Validation des champs
      const { username, password } = await request.validateUsing(loginValidator)
      console.log(' Validation VineJS réussie')

      // 2. Vérification des identifiants
      const user = await User.verifyCredentials(username, password)
      console.log(` Utilisateur trouvé: ${user.username} (ID: ${user.id})`)

      // 3. Création de la session
      await auth.use('web').login(user)

      return response.redirect().toRoute('decks.index')
    } catch (error) {
      console.error('--- DÉBOGAGE ERREUR ---')
      console.error(error.code) // Affiche le code d'erreur (ex: E_INVALID_CREDENTIALS)
      console.error(error.message) // Affiche le message explicite

      if (error.messages) {
        console.log('Erreurs de validation (VineJS):', error.messages)
      }

      session.flash('errors', 'Identifiants invalides')
      return response.redirect().back() // Plus sûr que de forcer une route
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login')
  }
}
