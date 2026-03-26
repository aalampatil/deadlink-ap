import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Homepage from './pages/Homepage'
import GenerateLink from './pages/GenerateLink'
import PublicUrl from './pages/PublicUrl'
import ManageUrlPage from './pages/ManageUrlPage'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          index: true,
          element: <Homepage />
        },
        {
          path: "create-link",
          element: <GenerateLink />
        },
        {
          path: "l/:slug",
          element: <PublicUrl />
        },
        {
          path: "manage",
          element: <ManageUrlPage />
        },
      ]
    }
  ])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
