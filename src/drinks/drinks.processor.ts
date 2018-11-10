import Processor from "../core/processor/processor";
import knex from 'knex';
import { Client } from "pg";
import { Drink } from "./drink.interface";
import { IngredientsProcessor } from "../ingredients/ingredients.processor";
import { link } from "fs";
import { Ingredient } from "../ingredients/ingredient.interface";

export class DrinksProcessor extends Processor {
	async createDrink(app: any, drink: Drink) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('drinks')
			.insert(drink)
			.returning('*')
			.toString();

		return database.query(query);
	}

	async createIngredientLinks(app, drink_id: number, ingredient_ids: number[]) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('drink_ingredients')
			.insert(ingredient_ids.map(i_id => { return { drink_id: drink_id, ingredient_id: i_id} }))
			.returning('*')
			.toString();

		return database.query(query);
	}

	async getDrink(app, drink: Drink) {
		const database = app.get('database') as Client;

		const query = knex({client: 'pg'})
			.table('drinks')
			.select('*')
			.where(drink)
			.toString();	

		return database.query(query);
	}

	async getDrinkObject(app, drink: Drink) {
		const database = app.get('database') as Client;

		const query = knex({ client: 'pg' })
			.table('drinks')
			.where(drink)
			.limit(1)
			.toString();		

		const response = await database.query(query);

		if(!response.rowCount) {
			return null;
		}

		const databaseDrink : Drink = response.rows[0];

		// Process the links between the drinks and ingredients.
		const ingredientQuery = knex({ client: 'pg'})
			.table('drink_ingredients')
			.where({ drink_id: databaseDrink.id })
			.join('ingredients', { 'drink_ingredients.ingredient_id':'ingredients.id'})
			.select('ingredients.id', 'ingredients.owner', 'ingredients.name')
			.toString();

		const linkedIngredientsResponse = await database.query(ingredientQuery);

		databaseDrink.ingredients = linkedIngredientsResponse.rows;

		return databaseDrink;
		
	}
}
