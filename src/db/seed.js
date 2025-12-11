import { db } from './db.js'
import { collections, users } from './schema.js'
import bcrypt from 'bcrypt'

async function seed() {
	console.log('Starting database seed...')

	try {
		await db.delete(users)
		await db.delete(collections)

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

		const result = await db.insert(users).values(seedUsers).returning()


		const SeedCollections = [
			{
				title: 'Capitale du monde',
				description: 'Connaissez-vous toutes les capitales du monde !',
				user_id : result[0].id,
			},
			{
				title : 'Les membres du Campus 3',
				description : 'Connaissez-vous tous les membres du Campus 3 ? ',
				user_id : result[0].id,
				private : true,
			}
		]

		const resultCollection = await db.insert(collections).values(SeedCollections).returning()

		

		console.log('Database seeded successfully!')
		console.log('email : ', result[0].email)
		console.log('password : motdepasse')
	} catch (error) {
		console.error('Error seeding database:', error)
	}
}

seed()