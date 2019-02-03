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

import { GroupsRoute } from './groups/groups.route';
import { GroupsProcessor } from './groups/groups.processor';

import { DatabaseSingleton } from './database';

const LISTEN_PORT = 80;



async function listenHTTP() {
	const app = express();

	// Middleware

	app.use(function(req, res, next) {
		console.log(req.url);
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

	const groupsRoute = new GroupsRoute();
	app.use('/', groupsRoute.router);
	app.set('groups.route', groupsRoute);
	app.set('groups.processor', new GroupsProcessor());
	
	app.listen(LISTEN_PORT, () => console.log(`Listening on port ${LISTEN_PORT}`));

	return app;
}

async function startApp() {
	const database = DatabaseSingleton.connection;
	const app = await listenHTTP();

	app.set('database', database);
}

startApp();
