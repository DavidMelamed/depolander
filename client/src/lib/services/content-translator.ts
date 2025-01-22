import OpenAI from "openai";
import type { ContentVersion, LanguageVersion } from "@db/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function translateContent(
  contentVersion: ContentVersion,
  targetLanguage: string
): Promise<Omit<LanguageVersion, "id" | "createdAt" | "updatedAt">> {
  try {
    const prompt = `
      Translate this mass tort landing page content to ${targetLanguage}.
      Maintain the legal and medical accuracy while adapting to cultural context.
      Keep all HTML tags and formatting intact.
      Preserve all placeholders and variables.
      
      Original content:
      ${JSON.stringify(contentVersion.content, null, 2)}

      Respond with JSON matching the original structure but with translated content.
      Maintain these special requirements:
      1. Keep medical terms consistent
      2. Preserve legal terminology accuracy
      3. Adapt CTAs and form labels appropriately
      4. Maintain citation references
      5. Preserve all disclaimer sections
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional legal and medical translator. Translate content while maintaining accuracy, context, and cultural appropriateness.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Failed to get translation from OpenAI");
    }

    const translatedContent = JSON.parse(response.choices[0].message.content);

    return {
      contentVersionId: contentVersion.id,
      language: targetLanguage,
      translatedContent,
      lastTranslated: new Date(),
      status: "pending", // Will be reviewed before setting to 'completed'
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate content: " + (error as Error).message);
  }
}

export async function validateTranslation(
  originalContent: any,
  translatedContent: any,
  targetLanguage: string
): Promise<{
  isValid: boolean;
  issues: Array<{ field: string; issue: string }>;
}> {
  const prompt = `
    Validate this translation for accuracy and completeness.
    Compare the original content with the translation and identify any issues.
    
    Original content:
    ${JSON.stringify(originalContent, null, 2)}
    
    Translated content (${targetLanguage}):
    ${JSON.stringify(translatedContent, null, 2)}
    
    Provide validation results in this JSON format:
    {
      "isValid": boolean,
      "issues": Array<{
        "field": string,
        "issue": string
      }>
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a translation quality assurance expert. Validate translations for accuracy, completeness, and cultural appropriateness.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  if (!response.choices[0].message.content) {
    throw new Error("Failed to get validation results from OpenAI");
  }

  return JSON.parse(response.choices[0].message.content);
}

export function getSupportedLanguages(): Array<{
  code: string;
  name: string;
  nativeName: string;
}> {
  return [
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands" },
    { code: "pl", name: "Polish", nativeName: "Polski" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
  ];
}
