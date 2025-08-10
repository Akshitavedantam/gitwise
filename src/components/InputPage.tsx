"use client";
import { useState } from "react";

export default function InputPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [scope, setScope] = useState("");
  const [aiSummary, setAiSummary] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      repoUrl,
      branch,
      scope,
      aiSummary,
    });
    // Here you would typically handle the form submission,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-28 px-6  text-white relative">
      <div className="absolute top-0 left-0 w-full h-full z-0">
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-center z-10 w-full max-w-7xl">

        <div className="flex-1 text-center md:text-left">
          <h1 className="mt-[-50] text-4xl font-bold mb-4">Welcome Name!</h1>
          <p className="text-lg opacity-80">
            Just paste a repository — we’ll unpack the rest.
          </p>
          <img
  src="/arrow.svg"
  alt="redirect arrow"
  className="w-60 absolute top-[20px] left-[18%] md:top-[20px] md:left-[48%] transform -translate-x-1/2 z-20"
/>

            
          
          <div className="mt-[-10] w-[500px] md:w-[500px] mx-auto md:mx-0">
            <img
              src="/girl.svg"
              alt="Dev illustration"
              className="w-full"
            />
          </div>
        </div>

       
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white/1 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg  left-[18%] md:left-[48%]  space-y-5 absolute-left-30 bottom-[50px] md:bottom-[50px] z-10"
        >
        
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="GitHub Repo URL"
            className="w-full px-4 py-3 rounded-full bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

         
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white/10 text-black border border-white/20 focus:outline-none"
          >
            <option value="">Branch</option>
            <option value="main">main</option>
            <option value="dev">dev</option>
          </select>

        
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={scope === "full"}
                onChange={() => setScope(scope === "full" ? "" : "full")}
              />
              Full Repo
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={scope === "last50"}
                onChange={() => setScope(scope === "last50" ? "" : "last50")}
              />
              Last 50 commits
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={aiSummary}
                onChange={() => setAiSummary(!aiSummary)}
              />
              AI-Summary
            </label>
          </div>

       
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 font-semibold hover:opacity-90 transition"
          >
            Analyse Repo
          </button>
        </form>
      </div>
    </div>
  );
}
