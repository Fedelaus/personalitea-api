import Route from "../core/route/route";
import { Request, Response } from "express";
import { IngredientsProcessor } from "./ingredients.processor";
import { Ingredient } from "./ingredient.interface";
import { StripUnknown } from "../core/route/validation.decorators";
import { BadRequestError } from "../core/errors/error.interface";

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
			funct: this.getIngredients.bind(this),
			authRequired: true
		});

		this.registerEndpoint({
			path: ':ingredientId',
			method: 'put',
			funct: this.updateIngredient.bind(this),
			authRequired: true
		});

		this.registerEndpoint({
			path: ':ingredientId',
			method: 'delete',
			funct: this.deleteIngredient.bind(this),
			authRequired: true
		});
	}

	async createIngredient(request: Request, response: Response) {
		const ingredientsProcessor = request.app.get('ingredients.processor') as IngredientsProcessor;

		const drink = { name: request.body.name, owner: request.app['token'].user.id } as Ingredient;

		const insertResponse = await ingredientsProcessor.createIngredient(request.app, drink);

		return response.send(insertResponse.rows[0]);
	}

	async getIngredients(request: Request, response: Response) {
		const ingredientsProcessor = request.app.get('ingredients.processor') as IngredientsProcessor;

		const ingredients = await ingredientsProcessor.getIngredients(request.app, request.query as Ingredient)

		return response.send(ingredients.rows);
	}

	async updateIngredient(request: Request, response: Response) {
		const ingredientsProcessor = request.app.get('ingredients.processor') as IngredientsProcessor;

		const ingredientId = request.params.ingredientId;

		// Ensure not empty
		const ingredient = request.body as Ingredient;

		// Ensure we aren't attempting to update the object with an empty one.
		if(!Object.keys(ingredient)) {
			return (new BadRequestError()).execute(response);
		}

		const updatedIngredient = await ingredientsProcessor.updateIngredients(request.app, ingredientId, ingredient);

		return response.send(updatedIngredient.rows[0]);
	}

	async deleteIngredient(request: Request, response: Response) {
		const ingredientsProcessor = request.app.get('ingredients.processor') as IngredientsProcessor;

		const ingredientId = request.params.ingredientId;

		const updatedIngredient = await ingredientsProcessor.deleteIngredient(request.app, ingredientId);

		return response.send({ 'affected': updatedIngredient.rowCount });
	}
}
