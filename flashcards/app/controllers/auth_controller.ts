import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    console.log(' Affichage de la page de login')
    return view.render('pages/auth/login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    console.log(' Tentative de connexion reçue...')
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
      console.log(' Session créée, redirection vers /decks')

      return response.redirect().toRoute('decks.index')
    } catch (error) {
      console.error(' Échec de la connexion')

      // Si l'erreur vient de la validation (VineJS)
      if (error.messages) {
        console.log(' Erreurs de validation:', error.messages)
      } else {
        console.log(' Cause probable: Mauvais mot de passe')
      }

      session.flash('errors', 'Identifiants invalides')
      return response.redirect().toRoute('deck.index')
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login')
  }
}
