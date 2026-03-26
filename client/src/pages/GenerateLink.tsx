import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { axiosApi } from "@/config/axiosApi";
import { Input } from "@/components/ui/input";

const GenerateLink = () => {
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const createLink = async () => {
    try {
      setLoading(true);

      const res = await axiosApi.post("/create", { title })
      console.log(res)

      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
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
        <Input type="text" placeholder="Project / Submission name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 border-border shadow-shadow p-3 outline-none bg-white" />

        <Button size="lg" onClick={createLink} className="text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading">
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
              use this url for submission
            </p>
            <p className="break-all border-2 border-border p-2 bg-white">
              {data.publicUrl}
            </p>

            <Button
              onClick={() => copyToClipboard(data.publicUrl)}
              className="text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading">
              Copy
            </Button>
          </div>

          {/* MANAGE URL */}
          <div className="border-4 border-border shadow-shadow bg-main p-5 flex flex-col gap-3">

            <h2 className="font-heading text-lg">Manage URL</h2>

            <p className="p-2 break-all border-2 border-border">
              Use this url to manage public url <br />
              COPY BOTH THE URL's AND DO NOT SHARE
            </p>
            <p className="break-all border-2 border-border p-2 bg-white">
              {data.manageUrl}
            </p>

            <Button onClick={() => copyToClipboard(data.manageUrl)} className="text-2xl w-fit bg-secondary-background border-2 border-border shadow-shadow rounded-none font-heading">
              Copy
            </Button>
          </div>

        </div>
      )}
    </div>
  );
};

export default GenerateLink;