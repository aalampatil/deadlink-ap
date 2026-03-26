import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
function App() {
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "bg-background min-h-screen", style: {
                backgroundImage: `
      linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(#fdf7c4)
    `,
                backgroundSize: "100px 100px, 100px 100px, 100% 100%",
            }, children: [_jsx(Header, {}), _jsx("div", { className: "min-h-screen", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }) }));
}
export default App;
