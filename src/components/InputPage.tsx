"use client";

import { useActionState } from "react";
import { analyzeRepository } from "@/app/actions/analyze"; 
import { motion } from "framer-motion"; // Optional: adds smooth fade-in
import { Loader2 } from "lucide-react"; // Install lucide-react if missing

// Initial state for the server action
const initialState = {
  success: false,
  message: '',
  data: null as any, 
  errors: {} as Record<string, string[]>
};

export default function InputPage() {
  // connect the form to the server action
  const [state, formAction, isPending] = useActionState(analyzeRepository, initialState);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-28 px-6 text-white relative overflow-hidden">
      
      {/* Background (Optional: Add your image/gradient here) */}
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-[#0a0a0a]"></div>

      <div className="flex flex-col md:flex-row gap-10 items-center z-10 w-full max-w-7xl relative">

        {/* --- LEFT COLUMN: Welcome Text + Illustration OR Results --- */}
        <div className="flex-1 text-center md:text-left min-h-[400px] flex flex-col justify-center">
          
          {/* Conditional Rendering: Show Results if success, otherwise show Welcome/Girl */}
          {state.success && state.data ? (
            // === RESULT CARD ===
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl border border-purple-500/30 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {state.data.name}
              </h2>
              <p className="text-gray-400 mb-6">{state.data.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-black/30 p-3 rounded-lg">
                  <div className="text-2xl font-bold">⭐ {state.data.stars}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Stars</div>
                </div>
                <div className="bg-black/30 p-3 rounded-lg">
                  <div className="text-2xl font-bold">🍴 {state.data.forks}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Forks</div>
                </div>
                <div className="bg-black/30 p-3 rounded-lg">
                  <div className="text-2xl font-bold">🐛 {state.data.openIssues}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Issues</div>
                </div>
              </div>

              {state.data.latestCommit && (
                 <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
                   <div className="text-xs text-purple-300 font-semibold mb-1">LATEST COMMIT</div>
                   <div className="text-sm text-gray-300 font-mono truncate">"{state.data.latestCommit.message}"</div>
                   <div className="text-xs text-gray-500 mt-2 flex justify-between">
                     <span>{state.data.latestCommit.author}</span>
                     <span>{new Date(state.data.latestCommit.date).toLocaleDateString()}</span>
                   </div>
                 </div>
              )}
            </motion.div>
          ) : (
            // === WELCOME STATE (Your Original Design) ===
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome!</h1>
              <p className="text-lg opacity-80 mb-8">
                Just paste a repository — we’ll unpack the rest.
              </p>
              
              {/* Arrow SVG */}
              <img
                src="/arrow.svg"
                alt="redirect arrow"
                className="hidden md:block w-40 absolute top-[10%] left-[45%] transform -translate-x-1/2 z-20 opacity-80"
              />

              <div className="w-[300px] md:w-[450px] mx-auto md:mx-0">
                <img
                  src="/girl.svg"
                  alt="Dev illustration"
                  className="w-full drop-shadow-2xl"
                />
              </div>
            </>
          )}
        </div>

        {/* --- RIGHT COLUMN: The Form --- */}
        <form
          action={formAction}
          className="flex-1 bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-5 border border-white/10"
        >
          {/* Repo URL Input */}
          <div>
            <input
              name="repoUrl"
              type="text"
              required
              placeholder="GitHub Repo URL (e.g. facebook/react)"
              className="w-full px-4 py-3 rounded-full bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {state.errors?.repoUrl && (
              <p className="text-red-400 text-sm mt-2 ml-2">{state.errors.repoUrl[0]}</p>
            )}
          </div>

          {/* Branch Select */}
          <select
            name="branch"
            className="w-full px-4 py-3 rounded-full bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
          >
            <option value="main">main</option>
            <option value="master">master</option>
            <option value="dev">dev</option>
          </select>

          {/* Scope Selection (Radios) */}
          <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-start">
            <label className="flex items-center gap-2 cursor-pointer hover:text-purple-300 transition">
              <input
                type="radio"
                name="scope"
                value="all-time"
                defaultChecked
                className="accent-purple-500 w-4 h-4"
              />
              Full Repo
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-purple-300 transition">
              <input
                type="radio"
                name="scope"
                value="last-30-days"
                className="accent-purple-500 w-4 h-4"
              />
              Last 30 Days
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-purple-300 transition">
              <input
                type="checkbox"
                name="aiSummary"
                className="accent-purple-500 w-4 h-4 rounded"
              />
              AI-Summary
            </label>
          </div>

        
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Decoding...
              </>
            ) : (
              "Analyse Repo"
            )}
          </button>

         
          {state.message && !state.success && (
            <div className="text-center p-3 bg-red-500/20 text-red-200 rounded-lg text-sm border border-red-500/30">
              {state.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}