import { env } from "process";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

export async function main() {
	try {
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		await mongoose.connect(env.DATABASE_URL!);

		console.log("Connected to MongoDB successfully 🎉.");
	} catch (error) {
		console.log(`Error BD: ${error}`);
	}
}
