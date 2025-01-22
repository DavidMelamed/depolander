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
  legalDeadline?: string;
}

interface TemplateData {
  campaign: CampaignInfo;
  evidence: MedicalEvidence;
  disclaimer: DisclaimerInfo;
  sections: {
    hero: boolean;
    benefits: boolean;
    evidence: boolean;
    settlement: boolean;
    callBanner: boolean;
  };
}

export async function extractContentFromCompetitor(
  content: string
): Promise<{
  drugInfo: { name: string; condition: string };
  structuredContent: string;
}> {
  const prompt = `
    Analyze the following legal marketing content and extract:
    1. The drug/product name
    2. The medical condition or injury
    3. Key information organized into these categories:
       - Medical evidence and studies
       - Qualification criteria
       - Symptoms and complications
       - Settlement information
       - Timeline and deadlines
       - Statistical data

    Format the response as a JSON object with these keys:
    {
      "drugInfo": {
        "name": "Drug name",
        "condition": "Medical condition"
      },
      "content": {
        "evidence": ["Study findings"],
        "qualifications": ["Criteria"],
        "symptoms": ["List of symptoms"],
        "settlement": {
          "amounts": ["Settlement amounts"],
          "process": ["Settlement process steps"]
        },
        "timeline": "Important dates and deadlines",
        "statistics": ["Key statistics"]
      }
    }

    Content to analyze:
    ${content}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a legal content analyst specializing in mass tort campaigns. Extract and organize relevant information while removing competitor-specific details.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  if (!response.choices[0].message.content) {
    throw new Error("Failed to get content from OpenAI");
  }

  const parsed = JSON.parse(response.choices[0].message.content);
  return {
    drugInfo: parsed.drugInfo,
    structuredContent: JSON.stringify(parsed.content, null, 2),
  };
}

export async function generateCampaignContent(
  config: ContentGeneratorConfig
): Promise<TemplateData> {
  const prompt = `
    Create a legal marketing campaign for ${config.drugName} related to ${config.condition}.
    Use the following competitor content as reference but create unique content:
    ${config.competitorContent}

    Create a campaign that follows our established template structure with these requirements:
    1. Compelling headlines and clear call-to-actions
    2. Evidence-based medical claims with citations
    3. Clear qualification criteria
    4. Settlement information and timeline
    5. Urgency indicators ${config.legalDeadline ? `(Deadline: ${config.legalDeadline})` : ''}

    Respond with a JSON object containing this structure:
    {
      "campaign": {
        "title": "Main campaign title",
        "phone": "(800) 555-0123",
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
      },
      "sections": {
        "hero": true,
        "benefits": true,
        "evidence": true,
        "settlement": true,
        "callBanner": true
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

  if (!response.choices[0].message.content) {
    throw new Error("Failed to get content from OpenAI");
  }

  return JSON.parse(response.choices[0].message.content);
}

export async function generateContentFromUrl(url: string): Promise<TemplateData> {
  // First, extract and structure the competitor content
  const extractedData = await extractContentFromCompetitor(url);

  // Then generate our campaign content using the structured data
  return generateCampaignContent({
    drugName: extractedData.drugInfo.name,
    condition: extractedData.drugInfo.condition,
    competitorContent: extractedData.structuredContent,
  });
}