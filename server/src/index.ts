import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import createApp from "./app.js";
import { connectDB } from "./db/db.js";
export const isDevelopment = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || "5000";

console.log("check 00");

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(
      `deadlink-ap server listening on :${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
