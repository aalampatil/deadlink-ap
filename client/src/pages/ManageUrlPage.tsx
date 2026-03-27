import { Button } from "@/components/ui/button";
import { axiosApi } from "@/config/axiosApi";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { toast } from "react-toastify";

interface LinkData {
    slug: string;
    displayTitle: string;
    status: string;
    mappedUrl?: string | null;
    mappedOn?: string | null;
}

const ManageUrlPage = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    console.log(slug)
    const { isLoaded, isSignedIn } = useAuth();
    const [data, setData] = useState<LinkData | null>(null);
    const [targetUrl, setTargetUrl] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch link details
    const fetchLink = async () => {
        if (!slug) return;

        if (!isSignedIn) {
            toast.error("You must be signed in to manage links");
            navigate("/sign-in");
            return;
        }

        try {
            const res = await axiosApi.get(`/link/public/${slug}`);
            setData(res.data);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to fetch link");
        }
    };

    // Map final URL
    const mapUrl = async () => {
        if (!slug) return;
        if (!targetUrl) {
            toast.error("Please enter a target URL");
            return;
        }

        try {
            setLoading(true);
            await axiosApi.post(`/link/${slug}/map`, { targetUrl });
            await fetchLink();
            setTargetUrl("");
            toast.success("URL mapped successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to map URL");
        } finally {
            setLoading(false);
        }
    };

    const copyText = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    useEffect(() => {
        if (!isLoaded) return; // Wait for Clerk to load

        if (!isSignedIn) {
            toast.error("You must be signed in to manage links");
            navigate("/sign-in");
            return;
        }


        fetchLink();
    }, [slug, isLoaded, isSignedIn]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Page Title */}
                <div className="border-4 border-border shadow-shadow bg-main p-4 text-center">
                    <h1 className="text-2xl sm:text-3xl font-heading">Manage Your Link</h1>
                </div>

                {/* Link Info */}
                {data && (
                    <div className="border-4 border-border shadow-shadow bg-secondary-background p-4 flex flex-col gap-4">
                        <div>
                            <p className="font-heading">Slug</p>
                            <p>{data.slug}</p>
                        </div>
                        <div>
                            <p className="font-heading">Title</p>
                            <p>{data.displayTitle}</p>
                        </div>
                        <div>
                            <p className="font-heading">Status</p>
                            <p className="font-thin text-xl">{data.status}</p>
                        </div>

                        {data.mappedUrl && (
                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                <p className="font-heading">Mapped URL</p>
                                <p className="break-all">{data.mappedUrl}</p>
                                <Button
                                    onClick={() => copyText(data.mappedUrl!)}
                                    className="bg-main border-2 border-border shadow-shadow rounded-none"
                                >
                                    Copy
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Map URL Form */}
                <div className="border-4 border-border shadow-shadow bg-main p-4 flex flex-col gap-4">
                    <h2 className="text-xl font-heading">Map Final URL</h2>

                    <input
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://your-final-work.com"
                        className="border-2 border-border p-3 shadow-shadow bg-secondary-background"
                    />

                    <Button
                        onClick={mapUrl}
                        disabled={loading}
                        size="lg"
                        className="w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none"
                    >
                        {loading ? "Mapping..." : "Map URL"}
                    </Button>

                    {data && (
                        <Button
                            onClick={() => navigate(`/l/${data.slug}`)}
                            disabled={loading}
                            size="lg"
                            className="w-fit bg-main border-2 border-border shadow-shadow rounded-none"
                        >
                            Public URL
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUrlPage;