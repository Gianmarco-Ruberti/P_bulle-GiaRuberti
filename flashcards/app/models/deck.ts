import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Card from '#models/card'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
// import User from './user.js'

export default class Deck extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @hasMany(() => Card)
  declare cards: HasMany<typeof Card>

  // @column()
  // declare userId: number

  // @belongsTo(() => User)
  // declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //------------
  /**
   * 2. L'objet $extras (SANS @column)
   * Quand on utilise .withCount('cards'), Adonis exécute un SELECT COUNT en SQL.
   * Il ne peut pas mettre le résultat dans 'cards' (qui est une relation),
   * donc il le place dans cet objet spécial nommé $extras.
   */
  @column()
  declare $extras: {
    cards_count?: number
  }

  /**
   * 3. Le Getter "Alias"
   * Pour éviter d'écrire {{ deck.$extras.cards_count }} dans tes vues HTML,
   * on crée ce raccourci.
   * Si cards_count n'existe pas (ex: on n'a pas fait le withCount), on renvoie 0.
   */
  get cardsCount() {
    return this.$extras.cards_count || 0
  }
}
