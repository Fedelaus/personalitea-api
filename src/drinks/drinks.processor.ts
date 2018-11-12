import Processor from "../core/processor/processor";
import Knex from 'knex';
import { Client } from "pg";
import { Drink } from "./drink.interface";
import { IngredientsProcessor } from "../ingredients/ingredients.processor";
import { link } from "fs";
import { Ingredient } from "../ingredients/ingredient.interface";
const knex = Knex({client: 'pg'})

export class DrinksProcessor extends Processor {
	
	async createDrink(app: any, drink: Drink) {
		const database = app.get('database') as Client;

		const query = knex
			.table('drinks')
			.insert(drink)
			.returning('*')
			.toString();

		return database.query(query);
	}

	async getDrinks(app, drink: Drink) {
		const database = app.get('database') as Client;
		
		// Query grabs the appropriate values from both drink_ingredients
		// and uses that information to build a json/array representation
		// of our full drinks object.
		let query = knex
			.table('drinks as d')
			.select('d.*', knex.raw('json_agg(ig) as ingredients'))
			.leftOuterJoin('drink_ingredients as di', { 'di.drink_id':'d.id' })
			.leftOuterJoin('ingredients as ig', { 'di.ingredient_id':'ig.id' })
			.groupBy('d.id', 'd.name');
		
		// Filter the query by ingredients
		if (drink.ingredients && drink.ingredients.length > 0) {
			query.whereIn('ig.id', drink.ingredients);
		}

		// Remove the ingredients from the object as it doesn't actually directly
		// exist there in the database.
		delete drink.ingredients;
		
		// Add the where clauses with their prefixes.
		Object.keys(drink).forEach(key => {
			query.where(`d.${key}`, drink[key]);
		});

		// Return the results of this query.
		return database.query(query.toString());
	}

	async updateDrink(app, queryDrink: Drink, drink: Drink) {
		const database = app.get('database') as Client;

		const query = knex
			.table('drinks')
			.where(queryDrink)
			.update(drink)
			.toString();	

		return database.query(query);
	}

	async deleteDrink(app, drinkId: number) {
		const database = app.get('database') as Client;

		const query = knex
			.table('drinks')
			.delete()
			.where({ id: drinkId })
			.toString();	

		return database.query(query);
	}

	async createIngredientLinks(app, drink_id: number, ingredient_ids: number[]) {
		const database = app.get('database') as Client;

		const query = knex
			.table('drink_ingredients')
			.insert(ingredient_ids.map(i_id => { return { drink_id: drink_id, ingredient_id: i_id} }))
			.returning('*')
			.toString();

		return database.query(query);
	}

	async deleteIngredientLinks(app, drink_id: number) {
		const database = app.get('database') as Client;

		const query = knex
			.table('drink_ingredients')
			.delete()
			.where({ drink_id: drink_id})
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
