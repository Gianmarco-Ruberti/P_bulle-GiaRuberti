import factory from '@adonisjs/lucid/factories'
import Deck from '#models/deck'

export const DeckFactory = factory
  .define(Deck, async ({ faker }) => {
    return {
      title: faker.lorem.words(2),
      description: faker.lorem.sentence(),
    }
  })
  .build()
