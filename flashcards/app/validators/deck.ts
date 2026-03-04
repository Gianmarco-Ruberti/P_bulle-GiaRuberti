// app/validators/deck.ts
import vine from '@vinejs/vine'

/**
 * Validateur pour la création d'un deck
 */
export const createDeckValidator = vine.compile(
  vine.object({
    title: vine.string().trim().unique({ table: 'decks', column: 'title' }),
    description: vine.string().trim().minLength(10),
  })
)

/**
 * Validateur pour la mise à jour d'un deck
 * Nous utilisons une fonction pour pouvoir passer l'ID du deck à exclure
 */
export const updateDeckValidator = (deckId: number) => {
  return vine.compile(
    vine.object({
      title: vine
        .string()
        .trim()
        .unique({
          table: 'decks',
          column: 'title',
          filter: (db) => {
            db.whereNot('id', deckId)
          },
        }),
      description: vine.string().trim().minLength(10),
    })
  )
}
