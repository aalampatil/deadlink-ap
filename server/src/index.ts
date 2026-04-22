import "dotenv/config";
import { env } from "./env.js";
export const isProduction = env.NODE_ENV === "production";
import createApp from "./app.js";
import { connectDB } from "./db/db.js";

const PORT = env.PORT ?? "5000";

if (!isProduction) {
  console.log("check 00");
}

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(
      `deadlink-ap server listening on :${PORT} in ${env.NODE_ENV} mode`,
    );
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
