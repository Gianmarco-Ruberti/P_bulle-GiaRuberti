import factory from '@adonisjs/lucid/factories'
import Deck from '#models/deck'

export const DeckFactory = factory
  .define(Deck, async ({ faker }) => {
    return {
      Title: faker.lorem.words(2),
      Description: faker.lorem.sentence(),
      cardsCount: faker.number.int({ min: 0, max: 50 }),
    }
  })
  .build()
