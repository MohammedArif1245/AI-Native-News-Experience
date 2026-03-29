/**
 * POST /api/briefing
 * Generates a structured AI briefing for a given news topic
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { topic, userType } = body;

    if (!topic || !topic.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    if (!userType || !["student", "investor", "founder"].includes(userType)) {
      return Response.json(
        { error: "Valid userType is required (student, investor, or founder)" },
        { status: 400 },
      );
    }

    // Build personalized system prompt based on user type
    const userTypeInstructions = {
      student: `
- Use simple, clear language that a student can understand
- Explain technical terms and jargon
- Focus on educational value and learning
- Include context and background information
- Make connections to real-world implications`,
      investor: `
- Focus on financial impact and market implications
- Highlight investment opportunities and risks
- Include data-driven insights and metrics
- Analyze stakeholder positions and strategic moves
- Consider market dynamics and competitive landscape`,
      founder: `
- Focus on business model implications and opportunities
- Highlight strategic insights for entrepreneurs
- Include actionable takeaways and lessons
- Analyze competitive dynamics and market gaps
- Consider innovation and disruption angles`,
    };

    const systemPrompt = `You are an expert news analyst that creates structured, insightful briefings.

User Type: ${userType.toUpperCase()}
${userTypeInstructions[userType]}

You must respond with ONLY valid JSON in this exact format:
{
  "summary": "A 3-4 sentence overview of the topic",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "stakeholders": ["stakeholder 1", "stakeholder 2", "stakeholder 3"],
  "impact": "2-3 sentences describing the impact on economy/business/users",
  "nextSteps": "2-3 sentences about what might happen next"
}

Rules:
- Be factual and balanced
- If you don't have current information, frame insights as "based on typical patterns" or "generally in such cases"
- Do not make up specific statistics or claims
- Keep all text clear and concise
- Ensure all JSON is properly formatted`;

    const userPrompt = `Analyze this news topic and provide a structured briefing: "${topic}"`;

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
              content: userPrompt,
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
    const content = aiData.choices[0].message.content;

    // Parse the JSON response
    let briefing;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      briefing = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate response structure
    if (
      !briefing.summary ||
      !briefing.keyPoints ||
      !briefing.stakeholders ||
      !briefing.impact ||
      !briefing.nextSteps
    ) {
      throw new Error("AI response missing required fields");
    }

    return Response.json({
      ...briefing,
      topic,
      userType,
    });
  } catch (error) {
    console.error("Error generating briefing:", error);
    return Response.json(
      { error: error.message || "Failed to generate briefing" },
      { status: 500 },
    );
  }
}
