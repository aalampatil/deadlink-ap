import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const Homepage = () => {

  const navigate = useNavigate()
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-12">

      {/* HERO */}
      <div className="w-full h-fit max-w-xl border-4 border-border shadow-shadow bg-secondary-background p-6 sm:p-10 flex flex-col gap-4">

        <h1 className="text-xl sm:text-4xl leading-tight">
          <span className="bg-main border-2 border-border shadow-shadow">Deadlines</span> getting spicy ?
        </h1>

        <p className="text-xl sm:text-2xl font-thin pl-4">
          <strong>deadlink</strong> Let's you publish a placeholder URL <br /> Use that <br /> Then map your real work once it's get ready for submission.
        </p>

        <div className="p-3">
          <Button onClick={() => navigate("create-link")} size="lg" className="text-2xl bg-main border-2 border-border shadow-shadow rounded-none font-heading">Create Link</Button>
        </div>
      </div>


      {/* HOW IT WORKS */}
      <div className="w-full max-w-xl h-fit border-4 border-border shadow-shadow bg-main p-6 sm:p-16 flex flex-col gap-8">

        <h1 className="text-xl w-fit sm:text-5xl bg-secondary-background border-2 border-border shadow-shadow">
          How it works?!</h1>

        <ul className="flex flex-col gap-2 list-decimal pl-8 text-2xl sm:text-3xl font-thin ">
          <li>Create a placeholder URL</li>
          <li>Use it before your deadline</li>
          <li>Map your final work later</li>
          <li>Public link updates instantly</li>
        </ul>
      </div>

    </div>
  );
};

export default Homepage;