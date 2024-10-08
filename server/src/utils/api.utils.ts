// relies on: error.utils.ts & types/ApiResponse.types.ts
import { Context } from 'hono';
import { ApiErrorResponse, ApiSuccessResponse } from '../types'; // TODO: Use aliases
import { ApiError, BadRequestError, getFriendlyZodErrorMessage } from './error.utils';
import { StatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';

/**
 * Generates an API error response object
 * @description This function creates a standardized error response object for API errors
 * @template E The type of the error object
 * @param {E} error The error object or message
 * @param {string} [message] An optional custom error message
 * @returns {ApiErrorResponse<E>} A standardized API error response object
 */

function _generateApiErrorResponse<E = any | ApiError | Error>(error: E, message?: string): ApiErrorResponse<E> {
	return {
		ok: false,
		message: message ?? 'An error occurred',
		error,
	};
}

/**
 * Generates an API success response object
 * @description This function creates a standardized success response object for API responses
 * @template T The type of the data being returned
 * @param {T} data The data to be included in the response
 * @param {string} [message] An optional custom success message
 * @returns {ApiSuccessResponse<T>} A standardized API success response object
 */
function _generateApiSuccessResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
	return {
		ok: true,
		data,
		message: message ?? 'Action was successful',
	};
}

/**
 * Handles API success and generates appropriate responses
 * @description This function processes successful API operations and creates standardized success responses
 * @template T The type of the data being returned
 * @param {Context} context The Hono context object
 * @param {T} data The data to be included in the response
 * @param {string} [message] An optional custom success message
 * @param {StatusCode} [statusCode] The HTTP status code for the response, defaults to 200
 * @returns {Response} A JSON response with the success details and appropriate status code
 */
export function handleApiSuccess<T>(context: Context, data: T, message?: string, statusCode: StatusCode = 200) {
	const apiResponse = _generateApiSuccessResponse(data, message);

	return context.json(apiResponse, statusCode);
}

/**
 * Handles API errors and generates appropriate responses
 * @description This function processes errors thrown during API operations and creates standardized error responses
 * @template E The type of the error object
 * @param {E} error The error object or message
 * @param {Context} context The Hono context object
 * @returns {Response} A JSON response with the error details and appropriate status code
 */
export function handleApiError<E = any>(context: Context, error: E) {
	let errorResponse: ApiErrorResponse<E>;
	let statusCode: StatusCode = 500;

	console.error('[error]', error);

	// Make zod errors more user friendly
	if (error instanceof ZodError) {
		const friendlyZodErrorMessage = getFriendlyZodErrorMessage(error);
		const friendlyZodError = new BadRequestError(friendlyZodErrorMessage);

		// A zod error is usually an indication that the request was bad, so we use a 400 status code
		statusCode = 400;
		errorResponse = _generateApiErrorResponse<any>(friendlyZodError, friendlyZodErrorMessage);
	}
	//
	else if (error instanceof ApiError || error instanceof Error) {
		// if api error, use the status code from the error - otherwise, keep the original status cod
		statusCode = error instanceof ApiError ? error.status : statusCode;
		errorResponse = _generateApiErrorResponse(error, error.message);
	}
	//
	else {
		errorResponse = _generateApiErrorResponse(error);
	}

	return context.json(errorResponse, statusCode);
}
