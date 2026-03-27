import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import GenerateLink from "./pages/GenerateLink";
import PublicUrl from "./pages/PublicUrl";
import ManageUrlPage from "./pages/ManageUrlPage";
import { ClerkProvider } from "@clerk/react";
import ProtectedRoute from "./config/Protected";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        index: true,
        element: <Homepage />,
      },
      {
        path: "create-link",
        element: (
          <ProtectedRoute>
            <GenerateLink />
          </ProtectedRoute>
        ),
      },
      {
        path: "l/:slug",
        element: (
          <ProtectedRoute>
            <PublicUrl />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage/:slug",
        element: <ManageUrlPage />,
      },
    ],
  },
  {
    path: "sign-in",
    element: <SignInPage />,
  },
  {
    path: "sign-up",
    element: <SignUpPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
);
