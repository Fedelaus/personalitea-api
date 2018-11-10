import Processor from "../core/processor/processor";
import knex from 'knex';
import { Client } from "pg";

import { User } from "./user.description";

export class AuthProcessor extends Processor {
	
	/**
	 * Create a user based on the object provided.
	 * @param app Express application to retrieve the database and other processors from
	 * @param user User object to insert into the database.
	 */
	async createUser(app: any, user: User) {
		const database = app.get('database') as Client;

		const query = knex({client:'pg'})
			.table('users')
			.insert(user)
			.returning('*')
			.toString();

		return database.query(query);
	}

	/**
	 * Get a single user based on the object provided.
	 * @param app Express application to retrieve the database and other processors from
	 * @param user Object to query a user with.
	 */
	async getUser(app: any, user: User) {
		const database = app.get('database') as Client;

		const query = knex({client:'pg'})
			.table('users')
			.select('*')
			.where(user)
			.limit(1)
			.toString();

		return database.query(query);
	}
	
	/**
	 * Get a list of users based on the object provided.
	 * @param app Express application to retrieve the database and other processors from
	 * @param user User object to query with.
	 */
	async getUsers(app: any, user: User) {
		const database = app.get('database') as Client;

		const query = knex({client:'pg'})
			.table('users')
			.select('*')
			.where(user)
			.toString();

		return database.query(query);
	}

	/**
	 * Update a user based on the user id provided and the user object.
	 * @param app Express application to retrieve the database and other processors from
	 * @param userId The user id to update
	 * @param user The new information to provide for the user.
	 */
	async updateUser(app: any, userId: number, user: User) {
		const database = app.get('database') as Client;

		const query = knex({client:'pg'})
			.table('users')
			.where({ id: userId })
			.update(user)
			.toString();

		return database.query(query);
	}

}