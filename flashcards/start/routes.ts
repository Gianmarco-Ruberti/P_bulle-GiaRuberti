/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '../app/controllers/auth_controller.js'
import DecksController from '../app/controllers/decks_controller.js'

router.get('/', [AuthController, 'index'])

router
  .group(() => {
    // Affiche le formulaire de création : GET /decks/new
    router.get('/new', [DecksController, 'create']).as('decks.create')

    // Traite la création : POST /decks
    router.post('/', [DecksController, 'store']).as('decks.store')

    // Affiche un deck spécifique : GET /decks/:id
    router.get('/:id', [DecksController, 'index']).as('decks.index')
  })
  .prefix('/decks')
