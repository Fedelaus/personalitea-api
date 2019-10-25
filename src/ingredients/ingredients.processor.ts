import Processor from '../core/processor/processor';
import { Ingredient } from './ingredient.interface';

export class IngredientsProcessor extends Processor {

	public async createIngredient(app: any, ingredient: Ingredient) {
		const database = this.getDatabase(app);

		const query = database('ingredients')
			.insert(ingredient)
			.returning('*');

		return query;
	}


	public async getIngredients(app, ingredient: Ingredient) {
		const database = this.getDatabase(app);

		const query = database('ingredients')
			.select('*')
			.where(ingredient)


		return query;
	}

	public async updateIngredients(app, ingredientId: number, ingredient: Ingredient) {
		const database = this.getDatabase(app);

		const query = database('ingredients')
			.where({ id: ingredientId })
			.update(ingredient)

		return query;
	}

	public async deleteIngredient(app, ingredientId: number) {
		const database = this.getDatabase(app);

		const query = database('ingredients')
			.delete()
			.where({ id: ingredientId })

		// TODO: consider the links?

		return query;
	}
}
