export interface User {
	id: number | undefined;
	username: string | undefined;
	email: string | undefined;
	password: string | undefined;
}

export class User implements User {
	constructor(
		public id: number | undefined,
		public username: string | undefined,
		public email: string | undefined,
		public password: string | undefined
	) { }
}


export interface UserToken {
	/** Expiry time of the token */
	expireTime: string;
	/** Data describing the session */
	sessionData: any;
}

export interface JWTSkeleton {
	/** Principle issuer of the token (Personaliea) */
	iss: string;
	/** Subject of the token, unique (user - Archelaus) */
	sub: string;
	/** Audience/s of the token */
	aud: string | string[];
	/** Expiry (UTC) of the token */
	exp: string
	/** Issue time */
	iat: string;
	/** Unique identifier of the JWT */
	jti: string;
	/** Further information for the JWT */
	context: any;
}