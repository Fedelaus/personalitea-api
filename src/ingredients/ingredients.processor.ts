import knex from 'knex';
import { Client } from 'pg';
import Processor from '../core/processor/processor';
import { Ingredient } from './ingredient.interface';

export class IngredientsProcessor extends Processor {

	public async createIngredient(app: any, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.insert(ingredient)
			.returning('*')
			.toString();

		return database.query(query);
	}


	public async getIngredients(app, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.select('*')
			.where(ingredient)
			.toString();


		return database.query(query);
	}

	public async updateIngredients(app, ingredientId: number, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.where({ id: ingredientId })
			.update(ingredient)
			.toString();

		return database.query(query);
	}

	public async deleteIngredient(app, ingredientId: number) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.delete()
			.where({ id: ingredientId })
			.toString();

		// TODO: consider the links?

		return database.query(query);
	}

	public async getIngredientObject(app, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.toString();

		console.log(query);

		return database.query(query);
	}

}
