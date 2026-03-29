/**
 * POST /api/query
 * Handles follow-up questions about a briefing
 */
export async function POST(request) {
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

    // Build context-aware system prompt
    const userTypeInstructions = {
      student: "Use simple language and explain concepts clearly",
      investor: "Focus on financial and market implications",
      founder: "Focus on business and strategic insights",
    };

    const systemPrompt = `You are a helpful news analyst assistant answering follow-up questions about a news briefing.

User Type: ${userType || "general"}
Instructions: ${userTypeInstructions[userType] || "Provide clear, concise answers"}

Context from previous briefing:
Topic: ${context.topic}
Summary: ${context.summary}
Key Points: ${context.keyPoints?.join("; ")}
Impact: ${context.impact}
Next Steps: ${context.nextSteps}

Rules:
- Answer the user's question directly and concisely
- Use information from the context when relevant
- If you don't know something, say so clearly
- Keep answers under 150 words
- Be conversational but informative`;

    // Call AI integration
    const aiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_CREATE_APP_URL}/integrations/google-gemini-2-5-flash/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: question,
            },
          ],
        }),
      },
    );

    if (!aiResponse.ok) {
      throw new Error(
        `AI integration failed: ${aiResponse.status} ${aiResponse.statusText}`,
      );
    }

    const aiData = await aiResponse.json();
    const answer = aiData.choices[0].message.content;

    return Response.json({
      answer,
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
