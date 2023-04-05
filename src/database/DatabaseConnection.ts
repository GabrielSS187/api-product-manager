import { env } from "process";
import mongoose from "mongoose";

// rome-ignore lint/style/noNonNullAssertion: <explanation>
mongoose.connect(env.DATABASE_URL!)
.then(() => {
  console.log("Connected to MongoDB successfully 🎉.");
})
.catch((err) => {
  console.log(err);
});