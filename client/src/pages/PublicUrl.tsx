import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosApi } from "@/config/axiosApi";
import { Button } from "@/components/ui/button";

type LinkData = {
    slug: string;
    status: "pending" | "ready";
    displayTitle: string;
    mappedUrl: string | null;
};

const PublicUrl = () => {
    const { slug } = useParams();
    const [data, setData] = useState<LinkData | null>(null);
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
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchLink();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="border-4 border-border shadow-shadow bg-secondary-background px-6 py-4 font-heading">
                    Loading...
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="border-4 border-border shadow-shadow bg-secondary-background px-6 py-4 font-heading">
                    Link not found
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <div className="max-w-xl w-full border-4 border-border shadow-shadow bg-secondary-background p-8 text-center space-y-4">

                <h1 className="text-2xl sm:text-3xl font-heading">
                    {data.displayTitle || "Submission Pending"}
                </h1>

                <p className="text-lg font-base">
                    This link has been created but the final URL has not been mapped yet.
                </p>

                <div className="border-2 border-border shadow-shadow bg-main px-4 py-3">
                    <p className="font-heading">Status: {data.status}</p>
                </div>

                <p className="text-sm">
                    The owner will update this link soon.
                </p>

                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                >
                    Refresh
                </Button>

            </div>
        </div>
    );
};

export default PublicUrl;