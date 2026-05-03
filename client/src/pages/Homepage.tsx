import { Button } from "@/components/ui/button";
import { IdCard, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Homepage = () => {

  const navigate = useNavigate()
  return (
    <div className="min-h-screen w-full px-6 py-10">
      <main className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="border-4 border-border bg-secondary-background p-6 shadow-shadow sm:p-10">
          <div className="mb-6 w-fit border-2 border-border bg-main px-3 py-2 font-heading shadow-shadow">
            deadlink workspace
          </div>

          <h1 className="max-w-3xl text-4xl leading-tight sm:text-6xl">
            Share before it is ready. Update when it is.
        </h1>

          <p className="mt-5 max-w-2xl text-lg sm:text-2xl">
            Create deadline-safe placeholder links and a public profile card for
            the places people should find you.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate("create-link")} size="lg" className="bg-main text-xl border-2 border-border shadow-shadow rounded-none font-heading">
              <Link2 size={20} />
              Create Link
            </Button>
            <Button onClick={() => navigate("card")} size="lg" className="bg-secondary-background text-xl border-2 border-border shadow-shadow rounded-none font-heading">
              <IdCard size={20} />
              Create Card
            </Button>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="border-4 border-border bg-main p-6 shadow-shadow">
            <h2 className="mb-4 w-fit border-2 border-border bg-secondary-background px-3 py-2 text-3xl font-heading shadow-shadow">
              Links
            </h2>
            <ol className="list-decimal space-y-2 pl-7 text-xl">
              <li>Create a placeholder URL</li>
              <li>Use it before your deadline</li>
              <li>Map your final work later</li>
              <li>Public link updates instantly</li>
            </ol>
          </div>

          <div className="border-4 border-border bg-secondary-background p-6 shadow-shadow">
            <h2 className="mb-4 w-fit border-2 border-border bg-main px-3 py-2 text-3xl font-heading shadow-shadow">
              Card
            </h2>
            <ol className="list-decimal space-y-2 pl-7 text-xl">
              <li>Pick a custom slug</li>
              <li>Add your socials and portfolio</li>
              <li>Share one public card URL</li>
            </ol>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Homepage;
