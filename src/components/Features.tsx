import { FeatureCard } from "./FeatureCard";
import { Search, FileCode, GitMerge, Bot } from "lucide-react";

const features = [
  {
    icon: <Search size={28} />,
    title: "Commit Timeline",
    description: (
      <>
        <span className="font-semibold text-white">Track Project History:</span><br/> Visually view every commit in sequence across branches, with context and annotations that actually make sense.
      </>
    ),
  },
  {
    icon: <FileCode size={28} />,
    title: "File Evolution",
    description: (
      <>
        <span className="font-semibold text-white">Understand How Code Changes Over Time:</span><br/> See who changed what, when, and why — for every file in the repository.
      </>
    ),
  },
  {
    icon: <GitMerge size={28} />,
    title: "Branch Flow Visualizer",
    description: (
      <>
        <span className="font-semibold text-white">Visualize Branches & Merges Clearly:</span> <br/>Instantly map out feature branches, merges, and rebases in a clean interactive flowchart.
      </>
    ),
  },
  {
    icon: <Bot size={28} />,
    title: "Smart Summarizer",
    description: (
      <>
        <span className="font-semibold text-white">Smart Summaries of Commits & PRs:</span><br/> Let GitWise explain complex commits and pull requests in plain English using natural language AI.
      </>
    ),
  },
];

export default function Features() {
  return (
    <section className="px-6 py-20">
      <h2 className="text-4xl font-bold text-center text-white mb-16 mt-[-80]">
        Break Down Repos Like a Pro
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
      
    </section>
  );
}
