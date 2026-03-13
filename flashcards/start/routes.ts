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
import CardsController from '../app/controllers/cards_controller.js'
import { middleware } from './kernel.js'

//auth
router.group(() => {
  router.get('/login', [AuthController, 'showLogin']).as('auth.login')
  router.post('/login', [AuthController, 'login']).as('auth.handleLogin')
})

router
  .group(() => {
    router.get('/', [DecksController, 'index']).as('decks.index')
    router.post('/logout', [AuthController, 'logout']).as('auth_logout')

    router
      .group(() => {
        router.get('/new', [DecksController, 'create']).as('decks.create')
        router.post('/', [DecksController, 'store']).as('decks.store')

        router.get('/:id', [DecksController, 'show']).as('decks.show')

        router.get('/:id/edit', [DecksController, 'edit']).as('decks.edit')
        router.put('/:id', [DecksController, 'update']).as('decks.update')

        router.delete('/delete/:id', [DecksController, 'destroy']).as('decks.destroy')
      })
      .prefix('/decks')

      router.group(() => {
      router.get('/:id/game', [DecksController, 'game']).as('decks.game')
      router.get('/:id/result', [DecksController, 'result']).as('decks.result')
      }).prefix('/game')

    router
      .group(() => {
        router.get('/new', [CardsController, 'create']).as('cards.create')
        router.post('/', [CardsController, 'store']).as('cards.store')
        router.get('/:id/edit', [CardsController, 'edit']).as('cards.edit')
        router.put('/:id', [CardsController, 'update']).as('cards.update')
        router.get('/:id', [CardsController, 'show']).as('cards.show')
        router.delete('/:id', [CardsController, 'destroy']).as('cards.destroy')
      })
      .prefix('/cards')
  })
  .use(middleware.auth())
