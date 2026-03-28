// import { Router } from "express";
// import { clerkClient, requireAuth, getAuth } from "@clerk/express";
// import type { Request, Response } from "express";

// export const userRouter = Router();

// userRouter
//   .route("/profile")
//   .get(requireAuth(), async (req: Request, res: Response) => {
//     const { userId } = getAuth(req);
//     console.log(userId);
//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const user = await clerkClient.users.getUser(userId);
//     return res.json({ user });
//   });
