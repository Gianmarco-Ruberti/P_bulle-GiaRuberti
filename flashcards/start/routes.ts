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

router.get('/', [AuthController, 'index'])

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

router
  .group(() => {
    router.get('/:id/edit', [CardsController, 'edit']).as('cards.edit')
    router.put('/:id', [CardsController, 'update']).as('cards.update')
    router.get('/:id', [CardsController, 'show']).as('cards.show')
    router.delete('/:id', [CardsController, 'destroy']).as('card.destroy')
  })
  .prefix('/card')
