import vine from '@vinejs/vine'

export const createCardValidator = vine.compile(
  vine.object({
    // Minimum 10 caractères pour la question
    question: vine
      .string()
      .trim()
      .minLength(10)
      .unique(async (db, value, field) => {
        // Vérifie l'unicité au sein du même deck (ici deckId 1 pour l'exemple)
        const deckId = field.data.deckId
        const card = await db
          .from('cards')
          .where('question', value)
          .where('deck_id', deckId)
          .first()
        return !card
      }),
    // Réponse non vide
    answer: vine.string().trim().minLength(1),
  })
)
