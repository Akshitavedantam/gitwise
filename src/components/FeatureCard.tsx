import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white/5 backdrop-blur-[4px] border border-white/10 rounded-[20px] p-6 min-h-[220px] flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-[#1f1f1f] rounded-md flex items-center justify-center text-purple-400">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white font-sans">{title}</h3>
        <p className="mt-2 text-gray-300 leading-relaxed font-sans">{description}</p>
      </div>
    </div>
  </div>
);
