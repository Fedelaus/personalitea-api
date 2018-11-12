import Route from "../core/route/route";
import { Request, Response } from "express";
import { Drink } from "./drink.interface";
import { DrinksProcessor } from "./drinks.processor";
import { IngredientsProcessor } from "../ingredients/ingredients.processor";
import { Ingredient } from "../ingredients/ingredient.interface";
import { StripUnknown, Validate } from "../core/route/validation.decorators";

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
			funct: this.getDrinks.bind(this),
			authRequired: true
		});

		this.registerEndpoint({
			path: ':drinkId',
			method: 'put',
			funct: this.updateDrink.bind(this),
			authRequired: true
		});

		this.registerEndpoint({
			path: ':drinkId',
			method: 'delete',
			funct: this.deleteDrink.bind(this),
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
		await drinksProcessor.createIngredientLinks(app, drinkId, ingredients);
		// Get the full ingredient name/information to return to the client.
		databaseDrink = await drinksProcessor.getDrinkObject(app, { id: drinkId } as Drink);
		// Respond to the client with the full object.
		response.send(databaseDrink);
	}

	@StripUnknown(['id', 'name', 'owner', 'ingredients'], [])
	async getDrinks(request: Request, response: Response) {
		const app = request.app;

		const drinksProcessor = app.get('drinks.processor') as DrinksProcessor;

		const drinkQuery = { id: request.query.id, name: request.query.name, owner: request.query.owner } as Drink;
		
		Object.keys(drinkQuery).forEach(k => { !drinkQuery[k] && delete drinkQuery[k] });

		const drinks = await drinksProcessor.getDrinks(app, drinkQuery, request.query.ingredients);

		response.send(drinks.rows);
	}

	async updateDrink(request: Request, response: Response) {
		const app = request.app;

		const drinksProcessor = app.get('drinks.processor') as DrinksProcessor;

		const drinkId : number = request.params.drinkId;

		const requestDrink = { name: request.body.name } as Drink;

		const updatedDrink = await drinksProcessor.updateDrink(app, drinkId, requestDrink);

		// Do we need to update the ingredients
		if(request.body.ingredients) {
			await drinksProcessor.deleteIngredientLinks(app, drinkId);
			await drinksProcessor.createIngredientLinks(app, drinkId, request.body.ingredients);
		}

		const drink = await drinksProcessor.getDrinkObject(app, { id: drinkId } as Drink);

		response.send(drink);
	}

	async deleteDrink(request: Request, response: Response) {
		const app = request.app;

		const drinksProcessor = app.get('drinks.processor') as DrinksProcessor;

		const drinkId : number = request.params.drinkId;

		const deletedDrink = await drinksProcessor.deleteDrink(app, drinkId);

		response.send({ 'affected': deletedDrink.rowCount});
	}
}