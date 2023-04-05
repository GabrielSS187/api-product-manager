export class CustomError extends Error {
	constructor(
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		public message: Record<string, string> | any,
		public statusCode: number,
	) {
		super(JSON.stringify(message));
	}
}
