import Knex from 'knex';
import minimist from 'minimist';

export class DatabaseConnection {

	connection;

	constructor(
		public username: string,
		public password: string,
		public hostname: string,
		public database: string
	) {
		this.connect().then(v => {
			console.log(v);
		}).catch(e => console.log);	
	}

	async connect() {
		console.log(this);
		this.connection = Knex({
			client: 'pg',
			connection: {
				user: this.username,
				host: this.hostname,
				database: `${this.database}?ssl=true`,
				password: this.password
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
	args.database
);