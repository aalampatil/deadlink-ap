import { Button } from "@/components/ui/button";
import { useCallback, useEffect, } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { toast } from "react-toastify";
import { useManageLinkStore } from "@/store/LinkStore";

const ManageUrlPage = () => {

    const { data, fetchLink, mapUrl, loading, fetching, targetUrl, setTargetUrl, file, setFile, contentType, setContentType } = useManageLinkStore()
    // add file state , file -

    const navigate = useNavigate();
    const { slug } = useParams();
    const { isLoaded, isSignedIn } = useAuth();

    const handleFetch = useCallback(async () => {
        if (!slug) return;

        await fetchLink(slug)

    }, [slug, fetchLink]);

    const handleMap = async () => {
        if (!slug) return;

        if (!contentType) {
            toast.error("Select Content Type");
            return;
        }

        if (contentType === "Post" && !targetUrl.trim()) {
            toast.error("Please enter a target URL");
            return;
        }
        if (contentType === "File" && !file) {
            toast.error("Please select a file");
            return;
        }



        await mapUrl(slug)
        // todo - send content_type and file
        toast.success("URL mapped successfully!");

    };

    const copyText = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch {
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            toast.success("Copied!");
        }
    };

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            toast.error("You must be signed in to manage links");
            navigate("/sign-in");
            return;
        }
        handleFetch();
    }, [slug, isLoaded, isSignedIn, fetchLink, navigate, handleFetch]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-3xl flex flex-col gap-6">

                {/* Page Title */}
                <div className="border-4 border-border shadow-shadow bg-main p-4 text-center">
                    <h1 className="text-2xl sm:text-3xl font-heading">Manage Your Link</h1>
                </div>

                {/* Link Info */}
                {fetching ? (
                    <div className="border-4 border-border shadow-shadow bg-secondary-background p-4 text-center">
                        <p>Loading...</p>
                    </div>
                ) : data ? (
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
                ) : null}

                {/* Map URL Form */}
                <div className="border-4 border-border shadow-shadow bg-main p-4 flex flex-col gap-4">
                    <h2 className="text-xl font-heading">Map Final URL</h2>

                    <select name="" id="" onChange={(e) => setContentType(e.target.value)} className="border-2 border-border p-3 shadow-shadow bg-secondary-background">
                        <option value="">Select Content Type</option>
                        <option value="Post">Post</option>
                        <option value="File">File</option>
                    </select>

                    {contentType === "Post" ? (
                        <input
                            type="text"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://your-final-work.com"
                            className="border-2 border-border p-3 shadow-shadow bg-secondary-background"
                        />
                    ) : (
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setFile(file);
                            }}
                            className="border-2 border-border p-3 shadow-shadow bg-secondary-background"
                        />
                    )}

                    <Button
                        onClick={handleMap}
                        disabled={loading || fetching}
                        size="lg"
                        className="w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none"
                    >
                        {loading ? "Mapping..." : "Map URL"}
                    </Button>

                    {data && (
                        <Button
                            onClick={() => navigate(`/l/${data.slug}`)}
                            disabled={loading || fetching}
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