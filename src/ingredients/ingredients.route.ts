import Route from "../core/route/route";
import { Request, Response } from "express";
import { IngredientsProcessor } from "./ingredients.processor";
import { Ingredient } from "./ingredient.interface";

export class IngredientsRoute extends Route {

	// Configuration 
	saltRounds: number = 10;

	constructor() {
		// Call the super class constructor
		super('ingredients', true);

		// Register register create user endpoint.
		this.registerEndpoint({
			path: 'create',
			method: 'post',
			funct: this.createIngredient.bind(this),
			authRequired: true
		});

		this.registerEndpoint({
			path: '',
			method: 'get',
			funct: this.getIngredient.bind(this),
			authRequired: true
		});
	}

	async createIngredient(request: Request, response: Response) {
		const ingredientsProcessor = request.app.get('ingredients.processor') as IngredientsProcessor;
		
		const requestToken = request['token'];

		const userId = requestToken.user.id;

		const drink = { name: request.body.name, owner: userId } as Ingredient;

		const insertResponse = await ingredientsProcessor.createIngredient(request.app, drink);

		if(insertResponse.rowCount !== 1) {
			// TODO: why would this happen? 
		}

		return response.send(insertResponse.rows[0]);
	}

	async getIngredient(request: Request, response: Response) {
		const ingredientsProcessor = request.app.get('ingredients.processor') as IngredientsProcessor;

		response.send(await ingredientsProcessor.getIngredientObject(request.app, {} as Ingredient));
	}
	

}