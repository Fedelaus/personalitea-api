// DEVELOPMENT STACK TRACES
import 'source-map-support/register'

import express from 'express';
import bodyParser from 'body-parser';
import { Client } from 'pg';

import { AuthProcessor } from './auth/auth.processor';
import { AuthRoute } from './auth/auth.route';
import { DrinksRoute } from './drinks/drinks.route';
import { DrinksProcessor } from './drinks/drinks.processor';
import { IngredientsRoute } from './ingredients/ingredients.route';
import { IngredientsProcessor } from './ingredients/ingredients.processor';
import { DatabaseSingleton } from './database';

const LISTEN_PORT = 3000;



async function listenHTTP() {
	const app = express();

	// Middleware

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "*");
		next();
	});

	app.use(bodyParser.json());

	// Register all endpoints here.
	const authRoute = new AuthRoute();
	app.use('/', authRoute.router);
	app.set('auth.route', authRoute);
	app.set('auth.processor', new AuthProcessor());

	const drinksRoute = new DrinksRoute();
	app.use('/', drinksRoute.router);
	app.set('drinks.route', drinksRoute);
	app.set('drinks.processor', new DrinksProcessor());

	const ingredientsRoute = new IngredientsRoute();
	app.use('/', ingredientsRoute.router);
	app.set('ingredients.route', ingredientsRoute);
	app.set('ingredients.processor', new IngredientsProcessor());
	
	app.listen(LISTEN_PORT, () => console.log(`Listening on port ${LISTEN_PORT}`));

	return app;
}

async function startApp() {
	const database = DatabaseSingleton.connection;
	const app = await listenHTTP();

	app.set('database', database);
}

startApp();
