import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '../../app/models/user.js'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        username: 'admin',
        password: 'admin123',
      },
    ])
  }
}
