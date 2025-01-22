import OpenAI from "openai";
import type { ContentVersion, UpdateSuggestion } from "@db/schema";
import { extractContentFromCompetitor } from "./content-generator";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ContentDiff {
  field: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
  priority: "low" | "medium" | "high";
}

export async function analyzeContentForUpdates(
  currentVersion: ContentVersion
): Promise<UpdateSuggestion> {
  try {
    const prompt = `
      Analyze this mass tort landing page content and suggest updates based on:
      1. Medical information accuracy
      2. Legal compliance
      3. Settlement status
      4. Timeline relevance
      5. Statistical data currency

      Current content:
      ${JSON.stringify(currentVersion.content, null, 2)}

      Provide specific update suggestions in this JSON format:
      {
        "suggestions": Array<{
          field: string;
          currentValue: string;
          suggestedValue: string;
          reason: string;
          priority: "low" | "medium" | "high"
        }>,
        "summary": string,
        "priority": "low" | "medium" | "high"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a legal content auditor specializing in mass tort marketing. Analyze content for accuracy, compliance, and currency. Suggest specific, actionable updates.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Failed to get content analysis from OpenAI");
    }

    const analysis = JSON.parse(response.choices[0].message.content);
    const suggestedChanges = {
      changes: analysis.suggestions,
      summary: analysis.summary,
    };

    return {
      contentVersionId: currentVersion.id,
      suggestedChanges,
      reason: analysis.summary,
      priority: analysis.priority,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Content analysis error:", error);
    throw new Error("Failed to analyze content for updates: " + (error as Error).message);
  }
}

export async function compareWithCompetitorContent(
  currentVersion: ContentVersion,
  competitorUrl: string
): Promise<UpdateSuggestion> {
  try {
    const { structuredContent } = await extractContentFromCompetitor(competitorUrl);
    
    const prompt = `
      Compare our mass tort landing page content with competitor content and suggest updates.
      Focus on:
      1. Information completeness
      2. Medical accuracy
      3. Legal compliance
      4. Unique value propositions
      5. Call-to-action effectiveness

      Our content:
      ${JSON.stringify(currentVersion.content, null, 2)}

      Competitor content:
      ${structuredContent}

      Provide update suggestions in this JSON format:
      {
        "suggestions": Array<{
          field: string;
          currentValue: string;
          suggestedValue: string;
          reason: string;
          priority: "low" | "medium" | "high"
        }>,
        "summary": string,
        "priority": "low" | "medium" | "high"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a legal marketing analyst specializing in mass tort campaigns. Compare content and suggest improvements while maintaining compliance and uniqueness.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Failed to get competitor analysis from OpenAI");
    }

    const analysis = JSON.parse(response.choices[0].message.content);
    const suggestedChanges = {
      changes: analysis.suggestions,
      summary: analysis.summary,
    };

    return {
      contentVersionId: currentVersion.id,
      suggestedChanges,
      reason: `Competitor analysis: ${analysis.summary}`,
      priority: analysis.priority,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Competitor analysis error:", error);
    throw new Error("Failed to compare with competitor content: " + (error as Error).message);
  }
}

export function calculateNextRefreshDate(frequency: string): Date {
  const now = new Date();
  switch (frequency.toLowerCase()) {
    case "daily":
      return new Date(now.setDate(now.getDate() + 1));
    case "weekly":
      return new Date(now.setDate(now.getDate() + 7));
    case "monthly":
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      throw new Error("Invalid frequency. Must be 'daily', 'weekly', or 'monthly'");
  }
}
