import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface UserProfile {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  foodPreference?: string;
  bmi?: {
    value: number;
    category: string;
  };
}

interface UserContext {
  profile: UserProfile;
  bodyNature?: string;
  recentChats?: any[];
  recentCheckIns?: any[];
}

async function analyzeUserContext(context: UserContext) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the following user data and provide insights about their health and wellness state. Focus on Ayurvedic principles and current health status.

User Profile:
${JSON.stringify(context.profile, null, 2)}

Body Nature (Dosha): ${context.bodyNature || "Unknown"}

Recent Check-ins: ${JSON.stringify(context.recentCheckIns, null, 2)}

Recent Chat History: ${JSON.stringify(context.recentChats, null, 2)}

Provide a concise analysis focusing on:
1. Current health state
2. Dominant dosha characteristics
3. Key health concerns or patterns
4. Recent wellness trends
5. Areas needing attention

Format the response as a JSON object with these exact keys:
{
  "healthState": "summary of current health",
  "doshaCharacteristics": ["characteristic1", "characteristic2"],
  "concerns": ["concern1", "concern2"],
  "trends": ["trend1", "trend2"],
  "attentionAreas": ["area1", "area2"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());
    return analysis;
  } catch (error) {
    console.error("Error analyzing user context:", error);
    return null;
  }
}

export async function getAyurvedicAdvice(
  message: string,
  context?: UserContext
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let userInsights = null;

    if (context) {
      userInsights = await analyzeUserContext(context);
    }

    const prompt = `As an Ayurvedic health advisor, provide personalized advice based on the following information. Focus on practical, holistic recommendations incorporating diet, lifestyle, and natural remedies. Keep the response concise and actionable.

${
  userInsights
    ? `User Analysis:
${JSON.stringify(userInsights, null, 2)}`
    : ""
}

User message: ${message}

Format your response using markdown with:
- Clear headings for different sections (##)
- Bullet points for lists
- *Emphasis* for important points
- > Blockquotes for traditional wisdom
- \`inline code\` for specific terms
- Proper spacing and formatting

Remember to:
1. Consider the user's dosha and current health state
2. Address any identified health concerns
3. Build upon positive wellness trends
4. Provide specific guidance for areas needing attention
5. Maintain a supportive and knowledgeable tone while providing structured, easy-to-read advice`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function getAyurvedicDietPlan(
  preferences: any,
  context?: UserContext
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let userInsights = null;

    if (context) {
      userInsights = await analyzeUserContext(context);
    }

    const prompt = `Create a 7-day Ayurvedic diet plan based on the following information. The response must strictly follow the specified JSON structure.

${
  userInsights
    ? `User Analysis:
${JSON.stringify(userInsights, null, 2)}`
    : ""
}

User preferences: ${JSON.stringify(preferences)}

Return a JSON array of daily plans with exactly this structure:
{
  "dailyPlans": [
    {
      "day": "Monday",
      "meals": [
        {
          "time": "Breakfast (7-8 AM)",
          "items": ["Item 1", "Item 2"],
          "herbs": ["Herb 1", "Herb 2"],
          "recipe": {
            "name": "Recipe Name",
            "ingredients": ["Ingredient 1", "Ingredient 2"],
            "instructions": ["Step 1", "Step 2"]
          }
        }
      ],
      "remedies": ["Remedy 1", "Remedy 2"]
    }
  ]
}

Requirements:
- Include exactly 7 days (Monday through Sunday)
- Each day must have at least 3 meals (Breakfast, Lunch, Dinner)
- Each meal must have items, herbs, and a recipe
- Include daily Ayurvedic remedies
- All arrays must have at least 2 items
- No null or empty values allowed
- Consider user's dosha and health state in recommendations
- Account for any dietary restrictions or preferences
- Include remedies targeting identified health concerns`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Remove any markdown code blocks
    text = text.replace(/```json\n?|\n?```/g, "");

    try {
      const dietPlan = JSON.parse(text);

      // Validate the structure
      if (!dietPlan.dailyPlans || !Array.isArray(dietPlan.dailyPlans)) {
        throw new Error("Invalid diet plan structure");
      }

      // Ensure we have exactly 7 days
      if (dietPlan.dailyPlans.length !== 7) {
        throw new Error("Diet plan must have exactly 7 days");
      }

      return dietPlan.dailyPlans;
    } catch (error) {
      console.error("Error parsing diet plan:", error);
      throw new Error("Failed to generate valid diet plan");
    }
  } catch (error) {
    console.error("Error getting diet plan:", error);
    throw new Error("Failed to generate diet plan");
  }
}

export async function getAyurvedicRecommendations(
  preferences: any,
  context?: UserContext
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let userInsights = null;

    if (context) {
      userInsights = await analyzeUserContext(context);
    }

    const prompt = `Generate personalized Ayurvedic wellness recommendations based on the following information. The response must strictly follow the specified JSON structure.

${
  userInsights
    ? `User Analysis:
${JSON.stringify(userInsights, null, 2)}`
    : ""
}

User profile: ${JSON.stringify(preferences)}

Return a JSON object with exactly this structure:
{
  "recommendations": {
    "mental": [
      {
        "title": "Practice Name",
        "description": "Brief description",
        "benefits": ["Benefit 1", "Benefit 2"],
        "instructions": ["Step 1", "Step 2"],
        "contraindications": ["Warning 1", "Warning 2"]
      }
    ],
    "physical": [
      {
        "title": "Exercise Name",
        "description": "Brief description",
        "benefits": ["Benefit 1", "Benefit 2"],
        "instructions": ["Step 1", "Step 2"],
        "contraindications": ["Warning 1", "Warning 2"]
      }
    ]
  }
}

Requirements:
- Include at least 3 mental practices (meditation, breathing exercises, etc.)
- Include at least 3 physical exercises (yoga poses, stretches, etc.)
- All recommendations must be based on Ayurvedic principles
- Each recommendation must have all fields filled
- Focus on practices suitable for the user's profile and current health state
- Include clear instructions and safety warnings
- Keep descriptions concise but informative
- Address identified health concerns and areas needing attention
- Build upon positive wellness trends`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Remove any markdown code blocks
    text = text.replace(/```json\n?|\n?```/g, "");

    try {
      const recommendations = JSON.parse(text);

      // Validate the structure
      if (
        !recommendations.recommendations ||
        !recommendations.recommendations.mental ||
        !recommendations.recommendations.physical
      ) {
        throw new Error("Invalid recommendations structure");
      }

      return recommendations.recommendations;
    } catch (error) {
      console.error("Error parsing recommendations:", error);
      throw new Error("Failed to generate valid recommendations");
    }
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
}

export async function analyzeSleepQuality(
  messages: any[],
  context?: UserContext
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let userInsights = null;

    if (context) {
      userInsights = await analyzeUserContext(context);
    }

    const prompt = `Analyze the following information about sleep and wellness. Determine the overall sleep quality as either "good", "average", or "bad". Only respond with one of these three words.

${
  userInsights
    ? `User Analysis:
${JSON.stringify(userInsights, null, 2)}`
    : ""
}

Chat history:
${JSON.stringify(messages, null, 2)}

Consider:
1. Recent sleep patterns and quality
2. User's dosha type and its influence on sleep
3. Any reported sleep disturbances or improvements
4. Overall wellness trends affecting sleep`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quality = response.text().trim().toLowerCase();

    // Ensure we only return valid values
    if (!["good", "average", "bad"].includes(quality)) {
      return "average";
    }

    return quality;
  } catch (error) {
    console.error("Error analyzing sleep quality:", error);
    return "average";
  }
}
