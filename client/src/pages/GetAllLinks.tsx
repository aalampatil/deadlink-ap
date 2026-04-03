import axiosApi from "@/config/axiosApi"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"

interface Link {
  _id: string
  displayTitle: string
  slug: string
  mappedUrl: string | null
  ownerId: string
  createdAt: string
  publicUrl: string
  manageUrl: string
  mappedOn: string | null
  updatedAt: string
}

function GetAllLinks() {
  const [allLinks, setAllLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)


  const fetchAllLinks = async () => {
    setLoading(true)

    try {
      const response = await axiosApi.get("/link/get-all")
      const data = response.data

      const links: Link[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.links)
          ? data.links
          : Array.isArray(data?.data)
            ? data.data
            : []

      setAllLinks(links)

    } catch (error) {
      console.error(error)
      setAllLinks([])

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllLinks()
  }, [])




  const copyToClipboard = (text?: string | null) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success("copied to clipboard")
  }

  const formatDate = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "—"

  return (
    <div className="min-h-screen bg-background font-mono">
      <main className="max-w-5xl mx-auto px-8 py-9">
        <header className="bg-main border border-border  w-fit p-2 my-4 hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1">Link Vault</header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 bg-white border-2 border-border shadow-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#facc0040] to-transparent animate-[shimmer_1.2s_infinite]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-row-2 gap-5">
            {allLinks.map((link) => (
              <div
                key={link._id}
                className="bg-white border-2 border-border p-5 flex flex-col gap-3 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-shadow transition-all"
              >
                {/* Title */}

                <div className="flex items-start justify-between gap-2">
                  <span className="font-sans font-black text-base leading-tight">
                    {link.displayTitle || "Untitled"}
                  </span>

                  <span
                    className={`w-4 h-4 rounded-full border- border-border shrink-0 mt-1 hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 ${link.mappedUrl ? "bg-[#15d600]" : "bg-[#d90808]"
                      }`}
                    title={link.mappedUrl ? "Active" : "Pending"}
                  />
                </div>

                {/* Mapped URL */}

                {link.mappedUrl ? (
                  <a
                    href={link.mappedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 text-xs text-gray-600 hover:text-black hover:underline hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 truncate"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M4.5 1H1v9h9V7M7 1h3m0 0v3M7 4l3-3"
                        stroke="#555"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="truncate">{link.mappedUrl}</span>
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">
                    URL not mapped yet
                  </span>
                )}

                {/* Slug */}


                <button
                  onClick={() =>
                    copyToClipboard(`${window.location.origin}/l/${link.slug}`)
                  }
                  className="flex items-center gap-1.5 bg-main border border-border  px-2.5 py-1 text-xs font-bold w-fit hover:bg-yellow-300 hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 transition-colors"
                >
                  /{link.slug}
                </button>



                {/* Dates */}

                <div className="flex justify-between text-sm text-black border-t border-dashed border-border pt-2.5">
                  <span>Created On: {formatDate(link.createdAt)}</span>
                  <span>Mapped On: {formatDate(link.mappedOn)}</span>
                </div>

                {/* Actions */}

                <div className="flex gap-2">

                  <Button onClick={() => copyToClipboard(link.mappedUrl)} disabled={!link.mappedUrl} className="flex-1 h-8 rounded-none border border-border  bg-white text-xs font-bold font-mono hover:bg-background hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 transition-colors" >
                    Copy Public URL ↗
                  </Button>

                  <Button onClick={() =>
                    link.mappedUrl && window.open(link.mappedUrl, "_blank")
                  }
                    disabled={!link.mappedUrl}
                    className={`flex-1 h-8 rounded-none border border-border  bg-white text-xs font-bold font-mono hover:bg-background hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 transition-colors ${!link.mappedUrl ? "cursor-none" : "cursor-pointer"} `}>Visit Public Url ↗</Button>



                  <Button
                    onClick={() =>
                      link.manageUrl && window.open(link.manageUrl, "_blank")
                    }
                    disabled={!link.manageUrl}
                    className={`flex-1 h-8 rounded-none border border-border bg-white text-xs font-bold font-mono hover:bg-background hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 transition-colors`}
                  >
                    Manage Url ↗
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  )
}

export default GetAllLinks