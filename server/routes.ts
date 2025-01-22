import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { leads, insertLeadSchema } from "@db/schema";
import { generateCampaignContent, generateContentFromUrl, extractContentFromCompetitor } from "../client/src/lib/services/content-generator";
import fs from "fs/promises";
import path from "path";

export function registerRoutes(app: Express): Server {
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const result = await db.insert(leads).values(validatedData).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  // Content generation endpoints
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

  // Test endpoint using our sample content
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

  const httpServer = createServer(app);
  return httpServer;
}