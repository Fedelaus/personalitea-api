import Route from "../core/route/route";
import { Request, Response } from "express";
import { Drink } from "./drink.interface";
import { DrinksProcessor } from "./drinks.processor";
import { IngredientsProcessor } from "../ingredients/ingredients.processor";
import { Ingredient } from "../ingredients/ingredient.interface";

export class DrinksRoute extends Route {

	// Configuration 
	saltRounds: number = 10;

	constructor() {
		// Call the super class constructor
		super('drinks', true);

		// Register register create user endpoint.
		this.registerEndpoint({
			path: 'create',
			method: 'post',
			funct: this.createDrink.bind(this),
			authRequired: true
		});

		this.registerEndpoint({
			path: '',
			method: 'get',
			funct: this.getDrink.bind(this),
			authRequired: true
		});

	}

	async createDrink(request: Request, response: Response) {
		const app = request.app;

		const drinksProcessor = app.get('drinks.processor') as DrinksProcessor;
		
		const requestToken = request['token'];

		const userId = requestToken.user.id;

		const drink = { name: request.body.name, owner: userId } as Drink;

		const insertDrink = await drinksProcessor.createDrink(app, drink);

		if(insertDrink.rowCount !== 1) {
			// TODO: why would this happen? 
		}

		const databaseDrink = insertDrink.rows[0];

		const drinkId = databaseDrink.id;

		// Create drink links

		const ingredients: number[] = request.body.ingredients;

		const insertIngredientLinks = await drinksProcessor.createIngredientLinks(app, drinkId, ingredients);

		// Get the full ingredient name/information to return to the client.

		const ingredientsProcessor = app.get('ingredients.processor') as IngredientsProcessor;

		databaseDrink.ingredients = await Promise.all(ingredients.map(async (ingredientId) => {
			const ingredient = await ingredientsProcessor.getIngredient(app, { id: ingredientId } as Ingredient);

			if(ingredient.rowCount < 1) {
				return {
					error: {
						message: 'Undefined ingredient'
					}
				}
			}

			return ingredient.rows[0];
		}));
		
		response.send(databaseDrink);
	}

	async getDrink(request: Request, response: Response) {
		const app = request.app;

		const drinksProcessor = app.get('drinks.processor') as DrinksProcessor;

		response.send(await drinksProcessor.getDrinkObject(app, request.body as Drink));
	}
}