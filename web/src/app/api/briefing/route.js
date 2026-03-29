/**
 * POST /api/briefing
 * Generates a structured AI briefing for a given news topic
 */
export async function action({ request }) {
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

    // Mock AI response for demo purposes
    const mockBriefing = generateMockBriefing(topic, userType);

    return Response.json({
      ...mockBriefing,
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

function generateMockBriefing(topic, userType) {
  const templates = {
    student: {
      summary: `${topic} is a significant development that affects many people in their daily lives. It involves important changes that students should understand for their future.`,
      keyPoints: [
        "This is a major news event with wide-reaching implications",
        "It affects students and young people specifically",
        "The government or organizations are taking action",
        "There are both benefits and challenges to consider"
      ],
      stakeholders: ["Students", "Teachers", "Government", "Parents", "Society"],
      impact: "This news affects how students learn, what opportunities are available, and what skills will be valuable in the future. Understanding this helps prepare for tomorrow.",
      nextSteps: "Continue watching for updates, research more about the topic, and consider how it might affect your future career or studies."
    },
    investor: {
      summary: `${topic} presents significant financial implications for markets and investment portfolios. Key stakeholders are making strategic moves that could affect market dynamics.`,
      keyPoints: [
        "Market impact is expected to be substantial",
        "Several companies stand to gain or lose from this",
        "Regulatory changes may affect investment strategies",
        "Analysts are closely watching the developments"
      ],
      stakeholders: ["Market Analysts", "Corporations", "Regulators", "Investors", "Banks"],
      impact: "This development could create new investment opportunities while also posing risks. Smart investors should monitor the situation and potentially adjust their portfolios.",
      nextSteps: "Review your portfolio for exposure, consider hedging strategies, and stay updated on regulatory developments that might affect your investments."
    },
    founder: {
      summary: `${topic} creates new opportunities and challenges for entrepreneurs and businesses. Understanding these dynamics is crucial for strategic planning.`,
      keyPoints: [
        "New business opportunities are emerging from this",
        "Competition landscape may shift significantly",
        "Customer expectations are evolving",
        "Innovation in this space is accelerating"
      ],
      stakeholders: ["Startups", "Enterprises", "Customers", "Investors", "Competitors"],
      impact: "This news affects business models, creates new market opportunities, and may require pivoting strategies. Founders should evaluate how it impacts their value proposition.",
      nextSteps: "Analyze how this affects your business model, explore partnership opportunities, and consider innovating to meet new market demands."
    }
  };

  return templates[userType] || templates.student;
}
