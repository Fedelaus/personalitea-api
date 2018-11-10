import Processor from "../core/processor/processor";
import knex from 'knex';
import { Client } from "pg";
import { Ingredient } from "./ingredient.interface";

export class IngredientsProcessor extends Processor {

	async createIngredient(app: any, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.insert(ingredient)
			.returning('*')
			.toString();

		return database.query(query);
	}


	async getIngredients(app, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.select('*')
			.where(ingredient)
			.toString();	


		return database.query(query);
	}

	async updateIngredients(app, ingredientId: number, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.where({ id: ingredientId })
			.update(ingredient)
			.toString();	

		return database.query(query);
	}

	async getIngredientObject(app, ingredient: Ingredient) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('ingredients')
			.toString();

		console.log(query);

		return database.query(query); 
	}

}
