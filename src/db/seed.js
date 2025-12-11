import { db } from './db.js'
import { users } from './schema.js'
import bcrypt from 'bcrypt'

async function seed() {
	console.log('Starting database seed...')

	try {
		await db.delete(users)

		const hashedPassword1 = await bcrypt.hash('motdepasse', 12)
		const hashedPassword2 = await bcrypt.hash('12345678', 12)

		const seedUsers = [
			{
				email : 'test@test.com',
				firstname : 'alexandre',
				lastname : 'LeRoy',
				password : hashedPassword1,
			},
			{
				email : 'test2@test.com',
				firstname : 'Cyprien',
				lastname : 'Duroy',
				password : hashedPassword2,
				admin : true
			}
		]


		// db.insert(users).values(seedUsers).returning().then((result) => console.log(result))
		const result = await db.insert(users).values(seedUsers).returning()

		console.log('Database seeded successfully!')
		console.log('email : ', result[0].email)
		console.log('password : motdepasse')
	} catch (error) {
		console.error('Error seeding database:', error)
	}
}

seed()