declare module "@clerk/express" {
  import type { RequestHandler } from "express";

  export const clerkMiddleware: (opts?: {
    signInUrl?: string;
    signUpUrl?: string;
  }) => RequestHandler;
  export const requireAuth: () => RequestHandler;
  export const getAuth: (req: any) => { userId?: string; sessionId?: string };
  export const clerkClient: any;
}
