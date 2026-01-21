/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import TeachersController from '#controllers/teachers_controller'
import router from '@adonisjs/core/services/router'
router.get('/', [TeachersController, 'index']).as('home')
// Route permettant de voir les détails d'un enseignant
router.get('/teacher/:id/show', [TeachersController, 'show']).as('teacher.show')
// Route permettant de supprimer un enseignant
router.delete('/teacher/:id/destroy', [TeachersController, 'destroy']).as('teacher.destroy')
// Route permettant d'afficher le formulaire permettant l'ajout d'un enseignant
router.get('/teacher/add', [TeachersController, 'create']).as('teacher.create')
// Route permettant l'ajout de l'enseignant
router.post('/teacher/add', [TeachersController, 'store']).as('teacher.store')
// Route permettant d'afficher le formulaire permettant la mise à jour d'un enseignant
router.get('/teacher/:id/edit', [TeachersController, 'edit']).as('teacher.edit')
// Route permettant la modification de l'enseignant
router.put('/teacher/:id/update', [TeachersController, 'update']).as('teacher.update')
