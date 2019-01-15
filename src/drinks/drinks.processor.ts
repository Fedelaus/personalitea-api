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
		const database = this.getDatabase(app);

		const query = database('drinks')
			.insert(drink)
			.returning('*'); 
		
		return query;
	}

	async getDrinks(app, drink: Drink) {
		const database = this.getDatabase(app);
		
		// Query grabs the appropriate values from both drink_ingredients
		// and uses that information to build a json/array representation
		// of our full drinks object.
		let query = database('drinks as d')
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
		return query;
	}

	async updateDrink(app, queryDrink: Drink, drink: Drink) {
		const database = this.getDatabase(app);

		const query = database('drinks')
			.where(queryDrink)
			.update(drink);

		return query;
	}

	async deleteDrink(app, drinkId: number) {
		const database = this.getDatabase(app);

		const query = database('drinks')
			.delete()
			.where({ id: drinkId });

		return query;
	}

	async createIngredientLinks(app, drink_id: number, ingredient_ids: number[]) {
		const database = this.getDatabase(app);

		const query = database('drink_ingredients')
			.insert(ingredient_ids.map(i_id => { return { drink_id: drink_id, ingredient_id: i_id} }))
			.returning('*')

		return query;
	}

	async deleteIngredientLinks(app, drink_id: number) {
		const database = this.getDatabase(app);

		const query = database('drink_ingredients')
			.delete()
			.where({ drink_id: drink_id})

		return query;
	}

	async getDrinkObject(app, drink: Drink) {
		const database = this.getDatabase(app);

		const query = database('drinks')
			.where(drink)
			.limit(1)

		const response = await query;

		if(!response.rowCount) {
			return null;
		}

		const databaseDrink : Drink = response.rows[0];

		// Process the links between the drinks and ingredients.
		const ingredientQuery = database('drink_ingredients')
			.where({ drink_id: databaseDrink.id })
			.join('ingredients', { 'drink_ingredients.ingredient_id':'ingredients.id'})
			.select('ingredients.id', 'ingredients.owner', 'ingredients.name')

		const linkedIngredientsResponse = await ingredientQuery;

		databaseDrink.ingredients = linkedIngredientsResponse.rows;

		return databaseDrink;
	}
}
