import Knex from 'knex';

export default class Processor {
	constructor() {

	}

	/**
	 * Utility function to return the database instance, typed.
	 * @param app Application instance
	 */
	getDatabase(app): Knex {
		return app.get('database');
	}
}