import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Route from "../core/route/route";
import { Router, Endpoint } from "../core/route/route.decorators";

import { AuthProcessor } from "./auth.processor";
import { User, UserToken } from "./user.description";
import { MissingResourceError, BadAuthenticationError, EmailInUseError } from "../core/errors/error.interface";
import { StripUnknown } from "../core/route/validation.decorators";


export class AuthRoute extends Route {

	// Configuration 
	saltRounds: number = 10;

	constructor() {
		// Call the super class constructor
		super('auth', false);

		// Register register create user endpoint.
		this.registerEndpoint({
			path: 'create',
			method: 'post',
			funct: this.createUser.bind(this),
			authRequired: false
		});

		this.registerEndpoint({
			path: 'login',
			method: 'post',
			funct: this.loginUser.bind(this),
			authRequired: false
		});
	}

	@StripUnknown([], ['username', 'email', 'password'])
	async createUser(request: Request, response: Response) {
		const authProcessor = request.app.get('auth.processor') as AuthProcessor;
		
		const user: User = request.body as User;
		
		user.password = await bcrypt.hash(user.password, this.saltRounds);

		try { 
			return response.send(await authProcessor.createUser(request.app, user));	
		} catch(error) {
			// TODO: pass errors to the error handler.
			return (new EmailInUseError()).execute(response);
		}

	}

	@StripUnknown([], ['email', 'password'])
	async loginUser(request: Request, response: Response) {
		const authProcessor = request.app.get('auth.processor') as AuthProcessor;

		const user: User = { email: request.body.email } as User;

		const databaseResponse = await authProcessor.getUser(request.app, user);
		
		if(databaseResponse.rowCount < 1) {
			return (new MissingResourceError(user, { email: user.email })).execute(response);
		}

		const rows = databaseResponse.rows;
		
		const databaseUser: User = rows[0] as User;

		try {
			await bcrypt.compare(request.body.password, databaseUser.password as string);

			const userJWT = await this.createUserToken(databaseUser);

			return response.send({ bearer: userJWT });
		} catch {
			return (new BadAuthenticationError()).execute(response);
		}

	}

	createUserToken(user: User): Promise<string> {
		const tokenData = {
			user: {
				id: user.id,
				username: user.username,
				email: user.email
			},
			iat: Date.now()
		}

		const tokenConfiguration = {
			expiresIn: '1hr'
		}

		const token = jwt.sign(tokenData, 'SECRET', tokenConfiguration);

		return token;
	}
	

	verifyUserToken(token: string) {
		return jwt.verify(token, 'SECRET');
	}
}
