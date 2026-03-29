/**
 * POST /api/query
 * Handles follow-up questions about a briefing
 */
export async function action({ request }) {
  try {
    const body = await request.json();
    const { question, context, userType } = body;

    if (!question || !question.trim()) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    if (!context) {
      return Response.json(
        { error: "Context (previous briefing) is required" },
        { status: 400 },
      );
    }

    // Mock response for demo
    const mockAnswer = generateMockAnswer(question, context, userType);

    return Response.json({
      answer: mockAnswer,
      question,
    });
  } catch (error) {
    console.error("Error processing query:", error);
    return Response.json(
      { error: error.message || "Failed to process query" },
      { status: 500 },
    );
  }
}

function generateMockAnswer(question, context, userType) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('who') || lowerQuestion.includes('stakeholder')) {
    return `The main stakeholders mentioned are: ${context.stakeholders?.join(", ")}. These groups are most directly affected by the developments in ${context.topic}.`;
  }
  
  if (lowerQuestion.includes('when') || lowerQuestion.includes('next') || lowerQuestion.includes('future')) {
    return context.nextSteps || "The situation is still evolving. Continue monitoring for updates in the coming days and weeks.";
  }
  
  if (lowerQuestion.includes('why') || lowerQuestion.includes('cause') || lowerQuestion.includes('reason')) {
    return "This development is driven by multiple factors including market forces, regulatory changes, and public demand. The exact reasons vary depending on stakeholder perspectives.";
  }
  
  if (lowerQuestion.includes('how') || lowerQuestion.includes('impact') || lowerQuestion.includes('effect')) {
    return context.impact || "The impact varies depending on who is affected. For detailed analysis of specific impacts, please refer to the briefing sections above.";
  }
  
  // Default response
  return `Based on the briefing about ${context.topic}, ${context.summary} You can find more details in the Key Points section of the briefing.`;
}
