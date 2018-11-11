import { Response } from "express";

export interface Error {
	message: string;
	httpStatusResponse: number;
	info: any;
}

export class HTTPError {
	constructor(public body: any, public status: number) {

	}

	execute(response: Response){
		return response.status(this.status).send(this.body);		
	}
}

export class MissingResourceError extends HTTPError {
	constructor(key: string | object, furtherDetails: any) {
		if(typeof key === 'object') {
			key = Object.keys(key).join(' 	& ');
		}

		super({
			identifier: key,
			message: `Missing resource for content by '${key}'`,
			details: furtherDetails
		}, 404);
	}
}


export class BadRequestError extends HTTPError {
	constructor() {
		super({
			message: `Request params or body malformed or not in correct state`,
		}, 400);
	}
}
export class BadAuthenticationError extends HTTPError {
	constructor() {
		super({
			message: `Bad authentication credentials provided`
		}, 400);
	}
}

export class UnauthorizedRequestError extends HTTPError {
	constructor() {
		super({
			message: `Unauthorized request to route that requires authentication`
		}, 403)
	}
}


export class EmailInUseError extends HTTPError {
	constructor() {
		super({
			message: `The email provided is currently in use.`
		}, 418)
	}
}