import Route from "../core/route/route";
import { Request, Response } from "express";
import { Drink } from "./drink.interface";
import { DrinksProcessor } from "./drinks.processor";
import { IngredientsProcessor } from "../ingredients/ingredients.processor";
import { Ingredient } from "../ingredients/ingredient.interface";
import { StripUnknown } from "../core/route/validation.decorators";

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

	@StripUnknown([], ['name', 'ingredients'])
	async createDrink(request: Request, response: Response) {
		// Assign app as a variable as it's used a lot in this method.
		const app = request.app;
		// Retrieve the drinks processor from the express application.
		const drinksProcessor = app.get('drinks.processor') as DrinksProcessor;
		// Retireve the user id from the JWT embedded in the bearer token.
		const userId = request['token'].user.id;
		// Create a drinks object and embed the owner id within it.
		const drink = { name: request.body.name, owner: userId } as Drink;
		
		// Insert the drink into the database.
		const insertDrink = await drinksProcessor.createDrink(app, drink);
		// Retrieve the drink from the response.
		let databaseDrink = insertDrink.rows[0];
		// Get the drink id for easy reference.
		const drinkId = databaseDrink.id;
		// Assign the ingredients for easy reference.
		const ingredients: number[] = request.body.ingredients;
		
		// Create a link for the drinks to ingredients (via the index table).
		const insertIngredientLinks = await drinksProcessor.createIngredientLinks(app, drinkId, ingredients);
		// Get the full ingredient name/information to return to the client.
		databaseDrink = await drinksProcessor.getDrinkObject(app, { id: drinkId } as Drink);
		// Respond to the client with the full object.
		response.send(databaseDrink);
	}

	@StripUnknown([], ['id', 'name', 'owner', 'ingredients'])
	async getDrink(request: Request, response: Response) {
		const app = request.app;

		console.log(request.body);

		const drinksProcessor = app.get('drinks.processor') as DrinksProcessor;

		response.send(await drinksProcessor.getDrinkObject(app, request.body as Drink));
	}
}