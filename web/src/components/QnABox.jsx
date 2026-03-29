import { useState } from "react";
import { Send, MessageCircle, Loader2 } from "lucide-react";

export default function QnABox({ briefing, userType }) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion("");
    setError(null);
    setLoading(true);

    // Add user question to conversation
    setConversation((prev) => [
      ...prev,
      { type: "question", text: userQuestion },
    ]);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          context: briefing,
          userType,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get answer: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Add AI answer to conversation
      setConversation((prev) => [
        ...prev,
        { type: "answer", text: data.answer },
      ]);
    } catch (err) {
      console.error("Error asking question:", err);
      setError("Failed to get an answer. Please try again.");
      // Remove the question if there was an error
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 shadow-md">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Ask Follow-up Questions
          </h3>
        </div>

        {/* Conversation history */}
        {conversation.length > 0 && (
          <div className="mb-4 space-y-3 max-h-96 overflow-y-auto">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.type === "question"
                    ? "bg-blue-50 border border-blue-100 ml-8"
                    : "bg-gray-50 border border-gray-100 mr-8"
                }`}
              >
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {msg.type === "question" ? "You asked:" : "Answer:"}
                </div>
                <div className="text-gray-800 text-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about this topic..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask</span>
              </>
            )}
          </button>
        </form>

        {conversation.length === 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            No questions yet. Ask something to dive deeper into this topic!
          </div>
        )}
      </div>
    </div>
  );
}
