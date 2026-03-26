import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
const Header = () => {
    const navigate = useNavigate();
    return (_jsxs("header", { className: "sm:flex-row sm:justify-between sm:h-20 w-full flex flex-col gap-3 items-center justify-center px-4 py-4 border-4 border-border shadow-shadow bg-secondary-background", children: [_jsx("h1", { onClick: () => navigate("/"), className: " cursor-pointer text-xs sm:text-2xl px-3 py-2 font-heading border-2 border-border shadow-shadow bg-main", children: "deadlink-ap" }), _jsx("p", { className: " text-sm sm:text-lg md:text-xl text-center px-3 py-2 border-2 border-border shadow-shadow bg-main", children: "not all the time, but might be that one moment" })] }));
};
export default Header;
