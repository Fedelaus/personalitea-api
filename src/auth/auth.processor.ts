import Processor from "../core/processor/processor";
import knex from 'knex';
import { Client } from "pg";

import { User } from "./user.description";

export class AuthProcessor extends Processor {
	async createUser(app: any, user: User) {
		const database = app.get('database') as Client;

		const query = knex({client:'pg'})
			.table('users')
			.insert(user)
			.toString();

		return database.query(query);
	}

	async login(app: any, user: User) {
		const database = app.get('database') as Client;

		const query = knex({client:'pg'})
			.table('users')
			.select('*')
			.where(user)
			.limit(1)
			.toString();

		return database.query(query);
	} 
}