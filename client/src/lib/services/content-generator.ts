import OpenAI from "openai";
import type { CampaignInfo, MedicalEvidence, DisclaimerInfo } from "../types/campaign";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ContentGeneratorConfig {
  drugName: string;
  condition: string;
  competitorContent: string;
}

export async function generateCampaignContent(
  config: ContentGeneratorConfig
): Promise<{
  campaign: CampaignInfo;
  evidence: MedicalEvidence;
  disclaimer: DisclaimerInfo;
}> {
  const prompt = `
    Create a legal marketing campaign for ${config.drugName} related to ${config.condition}.
    Use the following competitor content as reference but create unique content:
    ${config.competitorContent}

    Respond with a JSON object containing the following structure:
    {
      "campaign": {
        "title": "Main campaign title",
        "phone": "(800) 555-0123", // Use this default number
        "description": "Main description with key study findings",
        "mainHeadline": "Attention-grabbing headline",
        "subHeadline": "Supporting headline with key facts",
        "symptoms": ["list", "of", "symptoms"],
        "qualifications": ["list", "of", "qualification", "criteria"],
        "keyFacts": ["list", "of", "important", "facts"],
        "timeline": "Urgency statement",
        "legalStats": [
          { "number": "stat", "label": "description" }
        ],
        "settlementInfo": {
          "averageAmount": "Estimated average settlement amount",
          "range": "Settlement range",
          "timeline": "Expected timeline",
          "process": ["Step 1", "Step 2", "etc"]
        }
      },
      "evidence": {
        "studyTitle": "Title of primary study",
        "studyDate": "Study date",
        "studyUrl": "Study URL",
        "keyFindings": ["list", "of", "findings"]
      },
      "disclaimer": {
        "legalDisclaimer": "Legal disclaimer text",
        "medicalDisclaimer": "Medical advice disclaimer",
        "studyCitation": "Full study citation"
      }
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a legal marketing expert specializing in mass tort campaigns. Generate content that is factual, compelling, and compliant with legal marketing regulations.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

export async function extractContentFromCompetitor(
  content: string
): Promise<string> {
  const prompt = `
    Extract and organize the following content from a competitor's website.
    Remove any specific law firm information, contact details, or direct calls-to-action.
    Focus on:
    1. Medical condition information
    2. Scientific studies and evidence
    3. Qualification criteria
    4. Settlement information
    5. Timeline details

    Content to process:
    ${content}

    Respond with a clean, organized version of the content without any marketing language.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a content analyst specializing in legal marketing. Extract and organize relevant information while removing competitor-specific details.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}
