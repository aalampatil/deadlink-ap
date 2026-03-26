import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { axiosApi } from "@/config/axiosApi";
import { Input } from "@/components/ui/input";
const GenerateLink = () => {
    const [title, setTitle] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const createLink = async () => {
        try {
            setLoading(true);
            const res = await axiosApi.post("/create", { title });
            console.log(res);
            setData(res.data);
        }
        catch (err) {
            console.error(err);
            alert("Failed to create link");
        }
        finally {
            setLoading(false);
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied!");
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center px-6 py-10 gap-8", children: [_jsxs("div", { className: "w-full max-w-lg border-4 border-border shadow-shadow bg-main p-6 flex flex-col gap-4", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-heading", children: "Generate Placeholder Link" }), _jsx("p", { className: "text-sm", children: "Create a public link now and map your final project later." }), _jsx(Input, { type: "text", placeholder: "Project / Submission name", value: title, onChange: (e) => setTitle(e.target.value), className: "border-2 border-border shadow-shadow p-3 outline-none bg-white" }), _jsx(Button, { size: "lg", onClick: createLink, className: "text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading", children: loading ? "Generating..." : "Generate Link" })] }), data && (_jsxs("div", { className: "w-full max-w-lg flex flex-col gap-6", children: [_jsxs("div", { className: "border-4 border-border shadow-shadow bg-main p-5 flex flex-col gap-3", children: [_jsx("h2", { className: "font-heading text-lg", children: "Public URL" }), _jsx("p", { className: "break-all border-2 border-border p-2", children: "use this url for submission" }), _jsx("p", { className: "break-all border-2 border-border p-2 bg-white", children: data.publicUrl }), _jsx(Button, { onClick: () => copyToClipboard(data.publicUrl), className: "text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading", children: "Copy" })] }), _jsxs("div", { className: "border-4 border-border shadow-shadow bg-main p-5 flex flex-col gap-3", children: [_jsx("h2", { className: "font-heading text-lg", children: "Manage URL" }), _jsxs("p", { className: "p-2 break-all border-2 border-border", children: ["Use this url to manage public url ", _jsx("br", {}), "COPY BOTH THE URL's AND DO NOT SHARE"] }), _jsx("p", { className: "break-all border-2 border-border p-2 bg-white", children: data.manageUrl }), _jsx(Button, { onClick: () => copyToClipboard(data.manageUrl), className: "text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading", children: "Copy" })] })] }))] }));
};
export default GenerateLink;
