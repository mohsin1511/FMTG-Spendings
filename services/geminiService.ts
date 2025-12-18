
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Expense, InsightResponse } from "../types";

// Always use the standard initialization format from guidelines
// Correct: new GoogleGenAI({ apiKey: process.env.API_KEY })
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeExpenseAI = async (description: string): Promise<Category> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize the following expense description: "${description}". Choose exactly one from: ${Object.values(Category).join(", ")}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The best fitting category for the expense.",
            }
          },
          required: ["category"]
        }
      }
    });

    // Access .text property directly and provide fallback for JSON.parse
    const text = response.text;
    const data = JSON.parse(text || '{}');
    const matchedCategory = Object.values(Category).find(c => c.toLowerCase() === data.category?.toLowerCase());
    return (matchedCategory as Category) || Category.Others;
  } catch (error) {
    console.error("AI Categorization failed:", error);
    return Category.Others;
  }
};

export const getSpendingInsightsAI = async (expenses: Expense[]): Promise<InsightResponse> => {
  const expenseSummary = expenses.map(e => `${e.date}: ${e.description} - $${e.amount} (${e.category})`).join("\n");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these expenses and provide a brief financial summary and 3 actionable saving tips. Be friendly but professional.\n\nExpenses:\n${expenseSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "tips"]
        }
      }
    });

    // Access .text property directly and provide fallback for JSON.parse
    const text = response.text;
    return JSON.parse(text || '{"summary": "No data available", "tips": []}');
  } catch (error) {
    console.error("AI Insights failed:", error);
    return {
      summary: "I couldn't analyze your data right now. Please try again later.",
      tips: ["Keep tracking your daily expenses to stay mindful."]
    };
  }
};
