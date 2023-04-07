export class CustomError extends Error {
	constructor(
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		public message: string,
		public statusCode: number,
	) {
		super(JSON.stringify(message));
	}
}
