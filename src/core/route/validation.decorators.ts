import { Request, Response } from "express";

/**
 * Returns the missing keys within an object. (Doesn't return extra keys)
 * @param data The data to check
 * @param requiredKeys Array of strings of which must exist in data.
 */
export function getMissingKeys(data: object, requiredKeys: Array<string>): Array<string>{
	const dataKeys = Object.getOwnPropertyNames(data);

	return requiredKeys.filter(key => !dataKeys.includes(key));
}

/**
 * Returns the extra keys in the data. (Doesn't return missing keys)
 * @param data The data to check
 * @param knownKeys Array of strings of which must exist as keys in the data
 */
export function getExtraKeys(data: object, knownKeys: Array<string>): Array<string> {
	const dataKeys = Object.getOwnPropertyNames(data);

	return dataKeys.filter(key => !knownKeys.includes(key));
}

export function Validate(requiredQueryParams: any = [], requiredBodyParams: any = []) {	
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalFunction = target[propertyKey];

		descriptor.value = function(request: Request, response: Response) {
			const queryParams = request.params;
			const bodyParams = request.body;

			// Get the missing values per each data set.
			const missingQueryParams = getMissingKeys(queryParams, requiredQueryParams);
			const missingBodyParams = getMissingKeys(bodyParams, requiredBodyParams);

			// Create a list of errors
			const errors = [
				// Split the mapped array of JSON values for both query and body params.
				...missingQueryParams.map(missingKey => {
					return {
						message: `Missing Query Param`,
						field: missingKey
					}
				}),
				...missingBodyParams.map(missingKey => {
					return {
						message: `Missing Body Param`,
						field: missingKey
					}
				})
			];

			// If the errors list contains any errors we should assume the endpoint shouldn't receive the data and return errors.
			if(errors.length > 0) {
				response.status(400).send({errors: errors});
				return;
			}

			originalFunction.apply(this, arguments);
		}
	}
}

/**
 * 
 * @param knownParamKeys The known and acceptable keys for the params
 * @param knownBodyKeys The known and acceptable keys for the body
 * @param reject If the request is blocked, or if the keys are just stripped.
 */
export function StripUnknown(knownParamKeys?: string[], knownBodyKeys?: string[], reject: boolean = false) {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalFunction = target[propertyKey];

		descriptor.value = function(request: Request, response: Response) {
			const unknownParamKeys = getExtraKeys(request.param, knownParamKeys);
			const unknownBodyKeys = getExtraKeys(request.body, knownBodyKeys);

			// Create a list of errors
			const errors = [
				// Split the mapped array of JSON values for both query and body params.
				...unknownParamKeys.map(unknownKey => {
					// Delete the key from the request
					delete request.params[unknownKey];

					// Return a meaningful error message.
					return {
						message: `Unknown Query Param`,
						field: unknownKey
					}
				}),
				...unknownBodyKeys.map(unknownKey => {
					// Delete the key from the request
					delete request.body[unknownKey];

					// Return a meaningful error message.
					return {
						message: `Unknown Body Param`,
						field: unknownKey
					}
				})
			];


			if(reject && errors.length > 0){
				response.status(400).send({errors: errors});
				return;
			}

			originalFunction.apply(this, arguments);
		}
	}
}