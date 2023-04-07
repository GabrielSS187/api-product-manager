import { env } from "process";
import { config } from "dotenv";
import mongoose from "mongoose";

config();
// rome-ignore lint/style/noNonNullAssertion: <explanation>
mongoose.connect(env.DATABASE_URL!)
.then(() => {
  console.log("Connected to MongoDB successfully 🎉.");
})
.catch((err) => {
  console.log(err);
});