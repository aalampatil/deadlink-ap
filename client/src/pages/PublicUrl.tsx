import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { usePublicLinkStore } from "@/store/LinkStore";


const PublicUrl = () => {
    const { slug } = useParams();

    const { isLoading, data, fetchLink } = usePublicLinkStore()

    useEffect(() => {
        const handleFetch = async () => {
            if (!slug) return
            await fetchLink(slug)
        };

        if (slug) handleFetch();
    }, [slug, fetchLink]);

    if (isLoading) {
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

                <p className="text-sm">The owner will update this link soon.</p>

                <Button
                    onClick={() => slug && fetchLink(slug)}
                    className="mt-4 bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading"
                >
                    Refresh
                </Button>
            </div>
        </div>
    );
};

export default PublicUrl;