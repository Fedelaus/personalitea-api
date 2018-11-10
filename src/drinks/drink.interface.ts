import { User } from "../auth/user.description";

export interface Drink {
	id: number;
	name: string;
	owner: number;
	ingredients: number[];
}

export class Drink implements Drink {
	constructor(public id: number, public name: string, public owner: number, public ingredients: number[]) {
		
	}
}

export interface RichDrink {
	id: number;
	name: string;
	owner: User;
	// TODO: move this to the ingredients interface/object
	ingredients: number[];
}
