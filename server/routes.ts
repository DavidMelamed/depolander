import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { leads, insertLeadSchema, contentVersions, refreshSchedules, updateSuggestions, languageVersions, insertContentVersionSchema, insertRefreshScheduleSchema } from "@db/schema";
import { generateCampaignContent, generateContentFromUrl, extractContentFromCompetitor } from "../client/src/lib/services/content-generator";
import { analyzeContentForUpdates, compareWithCompetitorContent, calculateNextRefreshDate } from "../client/src/lib/services/content-refresh";
import { translateContent, validateTranslation, getSupportedLanguages } from "../client/src/lib/services/content-translator";
import { eq, and } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export function registerRoutes(app: Express): Server {
  // Existing routes
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const result = await db.insert(leads).values(validatedData).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  app.post("/api/generate-content", async (req, res) => {
    try {
      const config = req.body;
      const content = await generateCampaignContent(config);
      res.json(content);
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  app.post("/api/generate-from-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }
      const content = await generateContentFromUrl(url);
      res.json(content);
    } catch (error) {
      console.error("URL content generation error:", error);
      res.status(500).json({ error: "Failed to generate content from URL" });
    }
  });

  // New content version and refresh schedule endpoints
  app.post("/api/content-versions", async (req, res) => {
    try {
      const data = insertContentVersionSchema.parse(req.body);
      const result = await db.insert(contentVersions).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid content version data" });
    }
  });

  app.post("/api/content-versions/:id/schedule", async (req, res) => {
    try {
      const { id } = req.params;
      const { frequency } = req.body;

      const contentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
      });

      if (!contentVersion) {
        return res.status(404).json({ error: "Content version not found" });
      }

      const schedule = {
        contentVersionId: contentVersion.id,
        frequency,
        nextRefreshDate: calculateNextRefreshDate(frequency),
      };

      const result = await db.insert(refreshSchedules)
        .values(schedule)
        .returning();

      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  app.post("/api/content-versions/:id/analyze", async (req, res) => {
    try {
      const { id } = req.params;
      const contentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
      });

      if (!contentVersion) {
        return res.status(404).json({ error: "Content version not found" });
      }

      const suggestion = await analyzeContentForUpdates(contentVersion);
      const result = await db.insert(updateSuggestions)
        .values(suggestion)
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Content analysis error:", error);
      res.status(500).json({ error: "Failed to analyze content" });
    }
  });

  app.post("/api/content-versions/:id/compare", async (req, res) => {
    try {
      const { id } = req.params;
      const { competitorUrl } = req.body;

      const contentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
      });

      if (!contentVersion) {
        return res.status(404).json({ error: "Content version not found" });
      }

      const suggestion = await compareWithCompetitorContent(contentVersion, competitorUrl);
      const result = await db.insert(updateSuggestions)
        .values(suggestion)
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Competitor comparison error:", error);
      res.status(500).json({ error: "Failed to compare with competitor content" });
    }
  });

  app.get("/api/content-versions/:id/suggestions", async (req, res) => {
    try {
      const { id } = req.params;
      const suggestions = await db.query.updateSuggestions.findMany({
        where: eq(updateSuggestions.contentVersionId, parseInt(id)),
        orderBy: (suggestions) => suggestions.createdAt,
      });

      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.status(500).json({ error: "Failed to fetch update suggestions" });
    }
  });

  // Test endpoint using sample content
  app.get("/api/test-content-generation", async (req, res) => {
    try {
      const sampleContent = await fs.readFile(
        path.resolve(
          "attached_assets/Pasted-Depo-Provera-Lawsuit-Settlements-by-Ronald-V-Miller-Jr-Tweet-this-PostShare-on-FacebookShare-on-L-1737585620074.txt"
        ),
        "utf-8"
      );

      const { drugInfo, structuredContent } = await extractContentFromCompetitor(sampleContent);

      const generatedContent = await generateCampaignContent({
        drugName: drugInfo.name,
        condition: drugInfo.condition,
        competitorContent: structuredContent,
      });

      res.json(generatedContent);
    } catch (error) {
      console.error("Test content generation error:", error);
      res.status(500).json({ error: "Failed to generate test content" });
    }
  });


  // Language management endpoints
  app.get("/api/languages", (_req, res) => {
    const languages = getSupportedLanguages();
    res.json(languages);
  });

  app.post("/api/content-versions/:id/translate", async (req, res) => {
    try {
      const { id } = req.params;
      const { language } = req.body;

      const contentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
      });

      if (!contentVersion) {
        return res.status(404).json({ error: "Content version not found" });
      }

      // Check if translation already exists
      const existingTranslation = await db.query.languageVersions.findFirst({
        where: and(
          eq(languageVersions.contentVersionId, parseInt(id)),
          eq(languageVersions.language, language)
        ),
      });

      if (existingTranslation) {
        return res.status(400).json({ error: "Translation already exists" });
      }

      const translatedVersion = await translateContent(contentVersion, language);
      const result = await db.insert(languageVersions).values(translatedVersion).returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate content" });
    }
  });

  app.get("/api/content-versions/:id/translations", async (req, res) => {
    try {
      const { id } = req.params;
      const translations = await db.query.languageVersions.findMany({
        where: eq(languageVersions.contentVersionId, parseInt(id)),
      });

      res.json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  app.post("/api/language-versions/:id/validate", async (req, res) => {
    try {
      const { id } = req.params;
      const languageVersion = await db.query.languageVersions.findFirst({
        where: eq(languageVersions.id, parseInt(id)),
        with: {
          contentVersion: true,
        },
      });

      if (!languageVersion) {
        return res.status(404).json({ error: "Language version not found" });
      }

      const validation = await validateTranslation(
        languageVersion.contentVersion.content,
        languageVersion.translatedContent,
        languageVersion.language
      );

      res.json(validation);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(500).json({ error: "Failed to validate translation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}