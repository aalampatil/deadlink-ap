import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosApi } from "@/config/axiosApi";
import { Button } from "@/components/ui/button";
const PublicUrl = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchLink = async () => {
        try {
            const res = await axiosApi.get(`/public/${slug}`);
            const link = res.data;
            if (link.mappedUrl) {
                window.location.href = link.mappedUrl;
                return;
            }
            setData(link);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (slug)
            fetchLink();
    }, [slug]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "border-4 border-border shadow-shadow bg-secondary-background px-6 py-4 font-heading", children: "Loading..." }) }));
    }
    if (!data) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "border-4 border-border shadow-shadow bg-secondary-background px-6 py-4 font-heading", children: "Link not found" }) }));
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center px-4", children: _jsxs("div", { className: "max-w-xl w-full border-4 border-border shadow-shadow bg-secondary-background p-8 text-center space-y-4", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-heading", children: data.displayTitle || "Submission Pending" }), _jsx("p", { className: "text-lg font-base", children: "This link has been created but the final URL has not been mapped yet." }), _jsx("div", { className: "border-2 border-border shadow-shadow bg-main px-4 py-3", children: _jsxs("p", { className: "font-heading", children: ["Status: ", data.status] }) }), _jsx("p", { className: "text-sm", children: "The owner will update this link soon." }), _jsx(Button, { onClick: () => window.location.reload(), className: "mt-4", children: "Refresh" })] }) }));
};
export default PublicUrl;
