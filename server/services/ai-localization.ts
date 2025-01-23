import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { db } from "@db";
import { stateLocalizations, states, localizationJobs, type State, type LocalizationJob } from "@db/schema";
import { eq } from "drizzle-orm";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI();

interface StateInfo {
  name: string;
  code: string;
  region: string;
  population: number;
  majorCities: string[];
  demographics: Record<string, number>;
  healthcareStats: Record<string, number>;
}

interface LocalizationResult {
  content: {
    stateSpecificHeadline: string;
    stateSpecificDescription: string;
    localStatistics: {
      estimatedVictims: number;
      averageSettlement: string;
      timeToFile: string;
    };
    keyFacts: string[];
    testimonials: Array<{
      name: string;
      location: string;
      text: string;
    }>;
  };
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
    urlPath: string;
  };
}

export class AILocalizationService {
  private async getStateInfo(stateCode: string): Promise<StateInfo> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a data analyst specializing in U.S. state demographics and healthcare statistics."
      },
      {
        role: "user",
        content: `Provide detailed information about ${stateCode} including population, major cities, demographics, and healthcare statistics. Format as JSON.`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Failed to generate state information");
    }

    return JSON.parse(response.choices[0].message.content) as StateInfo;
  }

  private async generateLocalizedContent(stateInfo: StateInfo): Promise<LocalizationResult> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are a legal marketing specialist creating state-specific content for Depo-Provera lawsuit campaigns.
        Consider local demographics, healthcare access, and state-specific legal requirements.`
      },
      {
        role: "user",
        content: `Create localized content for ${stateInfo.name} (${stateInfo.code}). Include:
        - State-specific headline and description
        - Local statistics and estimates
        - Key facts relevant to ${stateInfo.name}
        - Testimonials from local areas
        - SEO metadata optimized for the state

        Important: The URL path should be in the format "depo-provera-lawsuit/${stateInfo.code.toLowerCase()}"

        Use this state data for context: ${JSON.stringify(stateInfo)}
        Format response as JSON matching the LocalizationResult type.`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Failed to generate localized content");
    }

    const result = JSON.parse(response.choices[0].message.content) as LocalizationResult;
    // Ensure the URL path follows our required format
    result.seoMetadata.urlPath = `depo-provera-lawsuit/${stateInfo.code.toLowerCase()}`;
    return result;
  }

  private async validateContent(content: LocalizationResult): Promise<{ isValid: boolean; feedback: string }> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a legal compliance officer reviewing marketing content for accuracy and compliance."
      },
      {
        role: "user",
        content: `Review this localized legal marketing content for accuracy, compliance, and effectiveness:
        ${JSON.stringify(content, null, 2)}

        Verify:
        1. No misleading claims
        2. Accurate statistics
        3. Appropriate testimonials
        4. Compliant disclaimers

        Return JSON: { "isValid": boolean, "feedback": string }`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      response_format: { type: "json_object" },
    });

    if (!response.choices[0].message.content) {
      throw new Error("Failed to validate content");
    }

    return JSON.parse(response.choices[0].message.content) as { isValid: boolean; feedback: string };
  }

  async startLocalizationJob(stateCode: string, contentVersionId: number): Promise<LocalizationJob> {
    // Get or create state
    const state = await db.query.states.findFirst({
      where: eq(states.code, stateCode.toUpperCase()),
    });

    if (!state) {
      throw new Error(`State ${stateCode} not found`);
    }

    // Create localization job
    const [job] = await db.insert(localizationJobs).values({
      contentVersionId,
      stateId: state.id,
      status: 'pending',
      currentStep: 'initialized',
    }).returning();

    // Start async process
    this.runLocalizationJob(job.id).catch(console.error);

    return job;
  }

  private async runLocalizationJob(jobId: number): Promise<void> {
    try {
      // Update job status
      await db.update(localizationJobs)
        .set({ status: 'processing', startedAt: new Date() })
        .where(eq(localizationJobs.id, jobId));

      // Get job details
      const job = await db.query.localizationJobs.findFirst({
        where: eq(localizationJobs.id, jobId),
        with: {
          state: true,
        },
      });

      if (!job?.state) {
        throw new Error('Job or state not found');
      }

      // Step 1: Gather state information
      await db.update(localizationJobs)
        .set({ currentStep: 'gathering_state_info', progress: 20 })
        .where(eq(localizationJobs.id, jobId));

      const stateInfo = await this.getStateInfo(job.state.code);

      // Step 2: Generate localized content
      await db.update(localizationJobs)
        .set({ currentStep: 'generating_content', progress: 40 })
        .where(eq(localizationJobs.id, jobId));

      const localizedContent = await this.generateLocalizedContent(stateInfo);

      // Step 3: Validate content
      await db.update(localizationJobs)
        .set({ currentStep: 'validating_content', progress: 60 })
        .where(eq(localizationJobs.id, jobId));

      const validation = await this.validateContent(localizedContent);

      if (!validation.isValid) {
        throw new Error(`Content validation failed: ${validation.feedback}`);
      }

      // Step 4: Save localization
      await db.update(localizationJobs)
        .set({ currentStep: 'saving_localization', progress: 80 })
        .where(eq(localizationJobs.id, jobId));

      const [stateLocalization] = await db.insert(stateLocalizations).values({
        stateId: job.state.id,
        contentVersionId: job.contentVersionId,
        localizedContent: localizedContent.content,
        localStats: localizedContent.content.localStatistics,
        seoMetadata: localizedContent.seoMetadata,
        status: 'draft',
        publishedUrl: localizedContent.seoMetadata.urlPath,
      }).returning();

      // Update job as completed
      await db.update(localizationJobs)
        .set({ 
          status: 'completed',
          progress: 100,
          currentStep: 'completed',
          completedAt: new Date(),
          result: { stateLocalizationId: stateLocalization.id }
        })
        .where(eq(localizationJobs.id, jobId));

    } catch (error) {
      // Update job with error
      await db.update(localizationJobs)
        .set({ 
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        })
        .where(eq(localizationJobs.id, jobId));

      throw error;
    }
  }
}

export const aiLocalizationService = new AILocalizationService();