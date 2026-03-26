import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Homepage from './pages/Homepage';
import GenerateLink from './pages/GenerateLink';
import PublicUrl from './pages/PublicUrl';
import ManageUrlPage from './pages/ManageUrlPage';
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(App, {}),
        children: [
            {
                path: "",
                index: true,
                element: _jsx(Homepage, {})
            },
            {
                path: "create-link",
                element: _jsx(GenerateLink, {})
            },
            {
                path: "l/:slug",
                element: _jsx(PublicUrl, {})
            },
            {
                path: "manage",
                element: _jsx(ManageUrlPage, {})
            },
        ]
    }
]);
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
