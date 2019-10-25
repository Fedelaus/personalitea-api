import Knex from 'knex';
import minimist from 'minimist';
import pg from 'pg';
pg.defaults.ssl = true;

export class DatabaseConnection {

	connection;

	constructor(
		public username: string,
		public password: string,
		public hostname: string,
		public database: string,
		public port: string
	) {
		this.connect().then(v => {
		}).catch(e => console.debug(e));	
	}

	async connect() {
		this.connection = Knex({
			client: 'pg',
			connection: {
				user: this.username,
				host: this.hostname,
				database: this.database,
				password: this.password,
				port: this.port
			},
		});
	}
}

// Pass args to minimist but remove 'node' and the file path first.
const args = minimist(process.argv.splice(2));

// Export this connection so it can be used everywhere.
export const DatabaseSingleton = new DatabaseConnection(
	args.username,
	args.password,
	args.hostname,
	args.database,
	args.db_port
);