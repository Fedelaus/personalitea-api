import { Router, RequestHandler, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UnauthorizedRequestError } from "../errors/error.interface";

export default class Route {
	constructor(
		public base: string,
		public authRequired: boolean,
		public router: Router = Router()
	){ }

	registerEndpoint(endpointDescription: EndpointDescription) : any {
		const fullRoute = `/${this.base}/${endpointDescription.path}`;

		if(endpointDescription.authRequired) {
			this.router[endpointDescription.method](fullRoute, this.verifyToken, endpointDescription.funct);
		} else {
			this.router[endpointDescription.method](fullRoute, endpointDescription.funct);
		}

		console.debug(`[registerEndpoint] Registered new endpoint [${endpointDescription.method}] ${fullRoute}`);
	}

	async verifyToken(request: Request, response: Response, next) {
		const authorization = request.headers.authorization;

		if(!authorization) {
			return (new UnauthorizedRequestError()).execute(response);
		}

		const token = request.headers.authorization.replace('Bearer ', '');

		let isTokenValid; 
		
		try {
			isTokenValid = jwt.verify(token, 'SECRET');
		} catch(error) {
			isTokenValid = false;
		}

		if(!isTokenValid) {
			return (new UnauthorizedRequestError()).execute(response);
		}

		request['token'] = isTokenValid;

		next();	
	}
}

export interface EndpointDescription {
	path: string;
	method: 'get' | 'post' | 'put';
	authRequired: boolean;
	funct: RequestHandler;
}

export interface Endpoint<T> {
	(request: Request, response: Response): T;
}