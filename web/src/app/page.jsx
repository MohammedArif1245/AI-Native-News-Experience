"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, RotateCcw } from "lucide-react";
import UserTypeSelector from "@/components/UserTypeSelector";
import BriefingDisplay from "@/components/BriefingDisplay";
import QnABox from "@/components/QnABox";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [userType, setUserType] = useState("student");
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevBriefingRef = useRef(null);

  // Deterministic scroll when briefing is populated
  useEffect(() => {
    if (briefing && !prevBriefingRef.current) {
      document.getElementById("briefing-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    prevBriefingRef.current = briefing;
  }, [briefing]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setBriefing(null);

    try {
      const response = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          userType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to generate briefing: ${response.status}`,
        );
      }

      const data = await response.json();
      setBriefing(data);
    } catch (err) {
      console.error("Error generating briefing:", err);
      setError(err.message || "Failed to generate briefing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBriefing(null);
    setTopic("");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">NewsAI</h1>
          </div>
          {briefing && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Briefing
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div
          className={`transition-all duration-500 ${briefing ? "mb-12" : "mb-0"}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Understand any news
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                in under 60 seconds
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered briefings tailored to your role. Get structured
              insights, not just headlines.
            </p>
          </div>

          {/* Input Form */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What news topic would you like to understand?
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Union Budget 2026, AI regulation, Climate summit..."
                    disabled={loading}
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    autoFocus
                  />
                </div>

                {/* User Type Selector */}
                <UserTypeSelector selected={userType} onSelect={setUserType} />

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating your briefing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Briefing</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Briefing Section */}
        {briefing && (
          <div id="briefing-section" className="scroll-mt-20">
            <BriefingDisplay briefing={briefing} />
            <QnABox briefing={briefing} userType={userType} />
          </div>
        )}

        {/* Empty State / Example Topics */}
        {!briefing && !loading && (
          <div className="max-w-3xl mx-auto mt-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Try these trending topics:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "AI regulation in the EU",
                "Federal Reserve interest rate decision",
                "Climate change summit outcomes",
                "Tech layoffs 2026",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setTopic(example)}
                  className="p-4 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-gray-900 font-medium">{example}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>Powered by AI • Built for clarity and speed</p>
        </div>
      </footer>
    </div>
  );
}
