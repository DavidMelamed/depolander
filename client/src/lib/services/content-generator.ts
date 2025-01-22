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

interface ExtractedData {
  drugInfo: {
    name: string;
    condition: string;
    type: string;
    manufacturer?: string;
  };
  content: {
    evidence: string[];
    qualifications: string[];
    symptoms: string[];
    settlement: {
      amounts: string[];
      process: string[];
      status: string;
    };
    timeline: string;
    statistics: string[];
    safetyInfo: {
      warnings: string[];
      contraindications: string[];
    };
  };
}

export async function extractContentFromCompetitor(
  content: string
): Promise<{
  drugInfo: { name: string; condition: string };
  structuredContent: string;
}> {
  const prompt = `
    Analyze the following legal marketing content with a focus on accuracy and compliance. Extract and structure:
    1. Drug/Product Information:
       - Name and type
       - Medical condition or injury
       - Manufacturer (if mentioned)

    2. Medical & Scientific Information:
       - Clinical studies and research findings
       - FDA warnings or recalls
       - Documented side effects
       - Safety information

    3. Legal Information:
       - Qualification criteria
       - Settlement status and amounts
       - Filing deadlines
       - Legal precedents

    4. Statistical Data:
       - Number of cases
       - Success rates
       - Settlement ranges
       - Demographic information

    Format the response as a strict JSON object matching this TypeScript interface:
    interface ExtractedData {
      drugInfo: {
        name: string;
        condition: string;
        type: string;
        manufacturer?: string;
      };
      content: {
        evidence: string[];
        qualifications: string[];
        symptoms: string[];
        settlement: {
          amounts: string[];
          process: string[];
          status: string;
        };
        timeline: string;
        statistics: string[];
        safetyInfo: {
          warnings: string[];
          contraindications: string[];
        };
      };
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
          "You are a legal content analyst specializing in mass tort campaigns. Extract and organize relevant information while ensuring accuracy and compliance with legal marketing regulations. Remove competitor-specific details and focus on factual information.",
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

  const parsed = JSON.parse(response.choices[0].message.content) as ExtractedData;
  return {
    drugInfo: {
      name: parsed.drugInfo.name,
      condition: parsed.drugInfo.condition,
    },
    structuredContent: JSON.stringify(parsed.content, null, 2),
  };
}

export async function generateCampaignContent(
  config: ContentGeneratorConfig
): Promise<TemplateData> {
  const prompt = `
    Create a comprehensive and compliant legal marketing campaign for ${config.drugName} related to ${config.condition}.
    Use this structured competitor content as reference but create unique content:
    ${config.competitorContent}

    Requirements:
    1. Content Structure:
       - Clear, factual headlines focusing on informing potential clients
       - Evidence-based medical claims with proper citations
       - Detailed qualification criteria
       - Current settlement information and timeline
       - Clear call-to-actions
       ${config.legalDeadline ? `- Urgency messaging regarding deadline: ${config.legalDeadline}` : ''}

    2. Compliance:
       - Avoid definitive success guarantees
       - Include proper medical and legal disclaimers
       - Maintain factual accuracy
       - Cite sources for medical claims

    3. User Experience:
       - Clear information hierarchy
       - Accessible language
       - Mobile-friendly content structure
       - Prominent contact information

    Respond with a JSON object matching this TypeScript interface:
    interface TemplateData {
      campaign: {
        title: string;
        phone: string;
        description: string;
        mainHeadline: string;
        subHeadline: string;
        symptoms: string[];
        qualifications: string[];
        keyFacts: string[];
        timeline: string;
        legalStats: Array<{ number: string; label: string }>;
        settlementInfo: {
          averageAmount: string;
          range: string;
          timeline: string;
          process: string[];
        };
      };
      evidence: {
        studyTitle: string;
        studyDate: string;
        studyUrl: string;
        keyFindings: string[];
      };
      disclaimer: {
        legalDisclaimer: string;
        medicalDisclaimer: string;
        studyCitation: string;
      };
      sections: {
        hero: boolean;
        benefits: boolean;
        evidence: boolean;
        settlement: boolean;
        callBanner: boolean;
      };
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a legal marketing expert specializing in mass tort campaigns. Generate content that is factual, compliant with legal marketing regulations, and focused on informing potential clients about their legal options.",
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
  try {
    // First, extract and structure the competitor content
    const extractedData = await extractContentFromCompetitor(url);

    // Generate our campaign content using the structured data
    return generateCampaignContent({
      drugName: extractedData.drugInfo.name,
      condition: extractedData.drugInfo.condition,
      competitorContent: extractedData.structuredContent,
    });
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error("Failed to generate content from URL: " + error.message);
  }
}