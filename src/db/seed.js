import { db } from './db.js'
import { collections, flashcards, users } from './schema.js'
import bcrypt from 'bcrypt'

async function seed() {
	console.log('Starting database seed...')

	try {
		await db.delete(users)
		await db.delete(collections)
		await db.delete(flashcards)

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
				is_private : true,
			}
		]

		const resultCollection = await db.insert(collections).values(SeedCollections).returning()

		const SeedFlashcards = [
			{
				front_text: 'Paris',
				back_text : 'France',
				url_front : 'https://www.okvoyage.com/wp-content/uploads/2023/10/Paris-en-photos-scaled.jpg',
				url_back : 'https://c8.alamy.com/compfr/g2xyg1/carte-vectorielle-detaillee-de-la-france-et-capitale-paris-g2xyg1.jpg',
				collection_id : resultCollection[0].id,
				user_id : result[0].id,
			},
			{
				front_text: 'Bruxelles',
				back_text : 'Belgique',
				url_front : 'https://img.20mn.fr/OUwnBcNCQ669K-HCXsa3rw/1444x920_bruxelles_une_cite_a_taille_humaine0',
				collection_id : resultCollection[0].id,
				user_id : result[0].id,
			},
			{
				front_text: 'Berlin',
				back_text : 'Allemagne',
				collection_id : resultCollection[0].id,
				user_id : result[0].id,
			},
			{
				front_text: 'Eric',
				back_text : 'Porcq',
				collection_id : resultCollection[1].id,
				user_id : result[0].id,
			},
			{
				front_text: 'Jean-Francois',
				back_text : 'Anne',
				collection_id : resultCollection[1].id,
				user_id : result[0].id,
			},
			{
				front_text: 'Clément',
				back_text : 'Catel',
				collection_id : resultCollection[1].id,
				user_id : result[0].id,
			}
		]

		const resultFlashcards = await db.insert(flashcards).values(SeedFlashcards).returning()

		console.log('Database seeded successfully!')
		console.log('email : ', result[0].email)
		console.log('password : motdepasse')
	} catch (error) {
		console.error('Error seeding database:', error)
	}
}

seed()