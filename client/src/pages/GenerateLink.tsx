import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useGenerateLinkStore } from "@/store/LinkStore";
import axios from "axios";

const GenerateLink = () => {
  const { displayTitle, data, loading, setDisplayTitle, createLink } = useGenerateLinkStore();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!isSignedIn) {
      toast.error("You must be signed in to generate links");
      navigate("/sign-in");
      return;
    }
    try {
      await createLink();
      toast.success("Link generated successfully!");
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Failed to generate link";
      toast.error(errorMessage);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 gap-8">

      {/* CREATE LINK CARD */}
      <div className="w-full max-w-lg border-4 border-border shadow-shadow bg-main p-6 flex flex-col gap-4">
        <h1 className="text-xl sm:text-2xl font-heading">
          Generate Placeholder Link
        </h1>

        <p className="text-sm">
          Create a public link now and map your final project later.
        </p>

        <Input
          type="text"
          placeholder="Project / Submission name"
          value={displayTitle}
          onChange={(e) => setDisplayTitle(e.target.value)}
          className="border-2 border-border shadow-shadow p-3 outline-none bg-white"
        />

        <Button
          disabled={loading}
          size="lg"
          onClick={handleCreate}
          className="text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading"
        >
          {loading ? "Generating..." : "Generate Link"}
        </Button>
      </div>

      {/* RESULT */}
      {data && (
        <div className="w-full max-w-lg flex flex-col gap-6">

          {/* PUBLIC URL */}
          <div className="border-4 border-border shadow-shadow bg-main p-5 flex flex-col gap-3">
            <h2 className="font-heading text-lg">Public URL</h2>
            <p className="break-all border-2 border-border p-2">
              Use this URL for submission
            </p>
            <p className="break-all border-2 border-border p-2 bg-white">
              {data.publicUrl}
            </p>
            <Button
              onClick={() => copyToClipboard(data.publicUrl)}
              className="text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading"
            >
              Copy
            </Button>
          </div>

          {/* MANAGE URL */}
          <div className="border-4 border-border shadow-shadow bg-main p-5 flex flex-col gap-3">
            <h2 className="font-heading text-lg">Manage URL</h2>
            <p className="p-2 break-all border-2 border-border">
              Use this URL to manage your public link. Only accessible to you.
            </p>
            <p className="break-all border-2 border-border p-2 bg-white">
              {data.manageUrl}
            </p>
            <Button
              onClick={() => copyToClipboard(data.manageUrl)}
              className="text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading"
            >
              Copy
            </Button>
          </div>

        </div>
      )}
    </div>
  );
};

export default GenerateLink;