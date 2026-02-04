import factory from '@adonisjs/lucid/factories'
import Card from '#models/card'

export const CardFactory = factory
  .define(Card, async ({ faker }) => {
    return {
      question: faker.lorem.sentence(),
      answer: faker.lorem.paragraph(),
      deck_id: faker.number.int({ min: 1, max: 10 }),
    }
  })
  .build()
