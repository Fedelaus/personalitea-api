export function Router<TFunction extends Function>(target: Function) {
	const originalConstructor = target;

	function instanciate(constructor: any, ...args: any[]) {
		return new constructor(args);
	}

	function newConstructor(...args: any[]) {
		const route: any = instanciate(originalConstructor, args);
		return route;
	}

	newConstructor.prototype = originalConstructor.prototype;

	return newConstructor as any;
}


export interface Endpoint {
	<T>(request: Express.Request, response: Express.Response): T;
}