import {
  Newspaper,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function BriefingDisplay({ briefing }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [briefing]);

  if (!briefing) return null;

  const sections = [
    {
      title: "Summary",
      icon: Newspaper,
      content: briefing.summary,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Key Points",
      icon: Sparkles,
      content: briefing.keyPoints,
      color: "from-indigo-500 to-indigo-600",
      isList: true,
    },
    {
      title: "Stakeholders",
      icon: Users,
      content: briefing.stakeholders,
      color: "from-purple-500 to-purple-600",
      isList: true,
    },
    {
      title: "Impact",
      icon: TrendingUp,
      content: briefing.impact,
      color: "from-green-500 to-green-600",
    },
    {
      title: "What Happens Next",
      icon: ArrowRight,
      content: briefing.nextSteps,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div
      className={`w-full max-w-4xl mx-auto transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {briefing.topic}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded-md capitalize">
            {briefing.userType}
          </span>
          <span>•</span>
          <span>Generated just now</span>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                animation: visible
                  ? `slideIn 0.5s ease-out ${index * 0.1}s both`
                  : "none",
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${section.color} shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>

                {section.isList ? (
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
