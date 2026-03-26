import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { axiosApi } from "@/config/axiosApi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const ManageUrlPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const slug = searchParams.get("slug");
    const key = searchParams.get("key");
    const [data, setData] = useState(null);
    const [targetUrl, setTargetUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const fetchLink = async () => {
        try {
            const res = await axiosApi.get(`/manage/${slug}`, {
                params: { key },
            });
            console.log(res);
            setData(res.data);
        }
        catch (err) {
            console.error(err);
        }
    };
    const mapUrl = async () => {
        try {
            setLoading(true);
            await axiosApi.post(`/${slug}/map`, {
                key,
                targetUrl,
            });
            await fetchLink();
            setTargetUrl("");
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        alert("copied to clipboard");
    };
    useEffect(() => {
        if (slug && key)
            fetchLink();
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-3xl flex flex-col gap-6", children: [_jsx("div", { className: "border-4 border-border shadow-shadow bg-main p-4 text-center", children: _jsx("h1", { className: "text-2xl sm:text-3xl font-heading", children: "Manage Your Link" }) }), data && (_jsxs("div", { className: "border-4 border-border shadow-shadow bg-secondary-background p-4 flex flex-col gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "font-heading", children: "Slug" }), _jsx("p", { children: data.slug })] }), _jsxs("div", { children: [_jsx("p", { className: "font-heading", children: "Status" }), _jsx("p", { className: "font-thin text-xl", children: data.status })] }), data.mappedUrl && (_jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:items-center", children: [_jsx("p", { className: "font-heading", children: "Mapped URL" }), _jsx("p", { className: "break-all", children: data.mappedUrl }), _jsx(Button, { onClick: () => copyText(data.mappedUrl), className: "bg-main border-2 border-border shadow-shadow rounded-none", children: "Copy to Confirm" })] }))] })), _jsxs("div", { className: "border-4 border-border shadow-shadow bg-main p-4 flex flex-col gap-4", children: [_jsx("h2", { className: "text-xl font-heading", children: "Map Final URL" }), _jsx("input", { value: targetUrl, onChange: (e) => setTargetUrl(e.target.value), placeholder: "https://your-final-work.com", className: "border-2 border-border p-3 shadow-shadow bg-secondary-background" }), _jsx(Button, { onClick: mapUrl, disabled: loading, size: "lg", className: "w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none", children: loading ? "Mapping..." : "Map URL" }), _jsx(Button, { onClick: () => navigate(`/l/${data.slug}`), disabled: loading, size: "lg", className: "w-fit bg-main border-2 border-border shadow-shadow rounded-none", children: "Public URL" })] })] }) }));
};
export default ManageUrlPage;
