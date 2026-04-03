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
    toast.success("Copied to clipboard")
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <header className="bg-main border border-border w-fit px-4 py-2 mb-6 text-sm sm:text-base hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 transition">
          Link Vault
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-white border border-border shadow-shadow relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#facc0040] to-transparent animate-[shimmer_1.2s_infinite]" />
              </div>
            ))}
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {allLinks.map((link) => (
              <div
                key={link._id}
                className="bg-white border-2 border-border p-4 sm:p-5 flex flex-col gap-3 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-shadow transition-all"
              >

                {/* Title */}

                <div className="flex items-start justify-between gap-2">
                  <span className="font-sans font-black text-sm sm:text-base">
                    {link.displayTitle || "Untitled"}
                  </span>

                  <span
                    className={`w-4 h-4 rounded-full border border-border shrink-0 mt-1 ${link.mappedUrl ? "bg-[#15d600]" : "bg-[#d90808]"
                      }`}
                    title={link.mappedUrl ? "Active" : "Pending"}
                  />
                </div>

                {/* URL */}

                {link.mappedUrl ? (
                  <a
                    href={link.mappedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs break-all bg-background border border-border px-3 py-2 hover:underline hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 transition"
                  >
                    {link.mappedUrl}
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">
                    URL not mapped yet
                  </span>
                )}

                {/* Slug */}

                <button
                  onClick={() => copyToClipboard(`${window.location.origin}/l/${link.slug}`)}
                  className="bg-main border border-border px-3 py-1 text-xs font-bold w-fit hover:bg-yellow-300 hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 transition"
                >
                  /{link.slug}
                </button>

                {/* Dates */}

                <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm border-t border-dashed border-border pt-2 gap-1">
                  <span>Created: {formatDate(link.createdAt)}</span>
                  <span>Mapped: {formatDate(link.mappedOn)}</span>
                </div>

                {/* Buttons */}

                <div className="flex flex-wrap gap-2 pt-2">

                  <Button
                    onClick={() => copyToClipboard(link.mappedUrl)}
                    disabled={!link.mappedUrl}
                    className="flex-1 min-w-30 h-8 rounded-none border border-border bg-white text-xs font-bold hover:bg-background hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1"
                  >
                    Copy URL
                  </Button>

                  <Button
                    onClick={() => link.mappedUrl && window.open(link.mappedUrl, "_blank")}
                    disabled={!link.mappedUrl}
                    className={`flex-1 min-w-30 h-8 rounded-none border border-border bg-white text-xs font-bold hover:bg-background hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1 ${!link.mappedUrl ? "cursor-not-allowed opacity-60" : ""
                      }`}
                  >
                    Visit ↗
                  </Button>

                  <Button
                    onClick={() => link.manageUrl && window.open(link.manageUrl, "_blank")}
                    disabled={!link.manageUrl}
                    className="flex-1 min-w-30 h-8 rounded-none border border-border bg-white text-xs font-bold hover:bg-background hover:shadow-shadow hover:-translate-x-1 hover:-translate-y-1"
                  >
                    Manage ↗
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