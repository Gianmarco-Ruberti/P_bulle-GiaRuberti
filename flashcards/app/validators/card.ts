import vine from '@vinejs/vine'

export const createCardValidator = vine.compile(
  vine.object({
    // Récupération du deckId pour l'unicité croisée
    deckId: vine.number().exists({ table: 'decks', column: 'id' }),

    question: vine
      .string()
      .trim()
      .minLength(10)
      .unique(async (db, value, field) => {
        // field.data contient l'objet en cours de validation
        const deckId = field.data.deckId
        const card = await db
          .from('cards')
          .where('question', value)
          .where('deck_id', deckId)
          .first()
        return !card
      }),

    answer: vine.string().trim().minLength(1),
  })
)
export const updateCardValidator = (cardId: number, deckId: number) => {
  return vine.compile(
    vine.object({
      question: vine
        .string()
        .trim()
        .minLength(10)
        .unique(async (db, value) => {
          const card = await db
            .from('cards')
            .where('question', value)
            .where('deck_id', deckId)
            .whereNot('id', cardId) // On ignore la carte en cours
            .first()
          return !card
        }),
      answer: vine.string().trim().minLength(1),
    })
  )
}
