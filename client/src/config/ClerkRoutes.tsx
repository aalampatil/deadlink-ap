import { ClerkProvider } from "@clerk/react";
import { Outlet } from "react-router-dom";

const ClerkRoutes = () => (
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <Outlet />
  </ClerkProvider>
);

export default ClerkRoutes;
