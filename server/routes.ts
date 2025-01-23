import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { leads, insertLeadSchema, contentVersions, templates, sections, adminUsers, insertAdminUserSchema } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";
import { isAdmin, isAuthenticated, isNotAuthenticated } from "./middleware/auth";
import passport from "passport";
import bcrypt from "bcryptjs";

export function registerRoutes(app: Express): Server {
  // Public routes (no auth required)
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const result = await db.insert(leads).values(validatedData).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", isNotAuthenticated, passport.authenticate("local"), (req, res) => {
    res.json({ message: "Logged in successfully" });
  });

  app.post("/api/auth/logout", isAuthenticated, (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Admin user management (protected)
  app.post("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        username,
        password: hashedPassword,
        role: 'admin',
      };

      const validatedData = insertAdminUserSchema.parse(userData);
      const result = await db.insert(adminUsers).values(validatedData).returning();

      // Remove password from response
      const { password: _, ...userWithoutPassword } = result[0];
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Admin routes (protected with isAdmin middleware)
  app.get("/api/admin/templates", isAdmin, async (_req, res) => {
    try {
      const allTemplates = await db.query.templates.findMany({
        with: {
          sections: {
            orderBy: (sections) => sections.order,
          },
          contentVersions: {
            where: eq(contentVersions.isActive, true),
          },
        },
      });
      res.json(allTemplates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/admin/templates", isAdmin, async (req, res) => {
    try {
      const { name, description, structure, phoneNumber } = req.body;
      const validatedData = {
        name,
        description,
        structure,
        phoneNumber,
      };
      const result = await db.insert(templates).values(validatedData).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.get("/api/admin/templates/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await db.query.templates.findFirst({
        where: eq(templates.id, parseInt(id)),
        with: {
          sections: {
            orderBy: (sections) => sections.order,
          },
          contentVersions: {
            where: eq(contentVersions.isActive, true),
          },
        },
      });

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.put("/api/admin/templates/:id/sections/:sectionId", isAdmin, async (req, res) => {
    try {
      const { id, sectionId } = req.params;
      const updateData = req.body;

      const result = await db
        .update(sections)
        .set(updateData)
        .where(
          and(
            eq(sections.id, parseInt(sectionId)),
            eq(sections.templateId, parseInt(id))
          )
        )
        .returning();

      if (!result.length) {
        return res.status(404).json({ error: "Section not found" });
      }

      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid section data" });
    }
  });

  // Public template view route - optimized for landing pages
  app.get("/api/templates/:id/view", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await db.query.templates.findFirst({
        where: eq(templates.id, parseInt(id)),
        columns: {
          id: true,
          name: true,
          structure: true,
          phoneNumber: true,
        },
        with: {
          sections: {
            orderBy: (sections) => sections.order,
            columns: {
              id: true,
              name: true,
              type: true,
              content: true,
              order: true,
              styles: true,
            }
          }
        }
      });

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Add GET endpoint for content versions
  app.get("/api/content-versions", async (_req, res) => {
    try {
      const allContentVersions = await db.query.contentVersions.findMany({
        orderBy: (versions) => desc(versions.createdAt),
      });
      res.json(allContentVersions);
    } catch (error) {
      console.error("Error fetching content versions:", error);
      res.status(500).json({ error: "Failed to fetch content versions" });
    }
  });
  app.post("/api/content-versions", isAdmin, async (req, res) => {
    try {
      const data = insertContentVersionSchema.parse(req.body);
      const result = await db.insert(contentVersions).values(data).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid content version data" });
    }
  });

  app.get("/api/content-versions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const version = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
        with: {
          refreshSchedules: true,
          updateSuggestions: true,
          languageVersions: true,
          template: {
            with: {
              sections: true,
            },
          },
          deployments: true,
          assets: true,
        },
      });

      if (!version) {
        return res.status(404).json({ error: "Content version not found" });
      }

      res.json(version);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content version" });
    }
  });

  //Deployment Routes
  app.post("/api/deployments", isAdmin, async (req, res) => {
    try {
      const validatedData = insertDeploymentSchema.parse(req.body);
      const result = await db.insert(deployments).values(validatedData).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(400).json({ error: "Invalid deployment data" });
    }
  });

  app.get("/api/deployments", async (_req, res) => {
    try {
      const allDeployments = await db.query.deployments.findMany({
        with: {
          contentVersion: true,
        },
        orderBy: (deployments) => desc(deployments.createdAt),
      });
      res.json(allDeployments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deployments" });
    }
  });

  // Content Generation
  app.post("/api/generate-content", isAdmin, async (req, res) => {
    try {
      const config = req.body;
      const content = await generateCampaignContent(config);
      res.json(content);
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  app.post("/api/generate-from-url", isAdmin, async (req, res) => {
    try {
      const { url, templateId, phoneNumber } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Get template if provided, or use default
      let templateData;
      if (templateId) {
        templateData = await db.query.templates.findFirst({
          where: eq(templates.id, parseInt(templateId))
        });
      } else {
        templateData = await db.query.templates.findFirst();
      }

      if (!templateData) {
        return res.status(400).json({ error: "No template available" });
      }

      // Generate content from URL
      const generatedContent = await generateContentFromUrl(url);

      // Create content version with template structure
      const contentVersion = {
        drugName: generatedContent.campaign.title,
        condition: generatedContent.campaign.description,
        content: {
          ...generatedContent,
          phoneNumber: phoneNumber || templateData.phoneNumber
        },
        version: 1,
        language: "en",
        isActive: true,
        templateId: templateData.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert into database
      const result = await db.insert(contentVersions).values(contentVersion).returning();

      // Create deployment
      const deploymentData = {
        contentVersionId: result[0].id,
        domain: `${contentVersion.drugName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.masslawsuits.com`,
        status: "pending",
        configuration: {
          template: templateData.id,
          phoneNumber: phoneNumber || templateData.phoneNumber,
          analytics: true
        }
      };

      const deployment = await db.insert(deployments)
        .values(deploymentData)
        .returning();

      res.json({
        contentVersion: result[0],
        deployment: deployment[0]
      });

    } catch (error) {
      console.error("URL content generation error:", error);
      res.status(500).json({ error: "Failed to generate content from URL" });
    }
  });

  // Refresh and Update Management
  app.post("/api/content-versions/:id/schedule", isAdmin, async (req, res) => {
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

  app.post("/api/content-versions/:id/analyze", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const contentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
      });

      if (!contentVersion) {
        return res.status(404).json({ error: "Content version not found" });
      }

      const suggestion = await analyzeContentForUpdates(contentVersion);

      // Ensure the suggestion has the correct structure
      const formattedSuggestion = {
        contentVersionId: contentVersion.id,
        suggestedChanges: {
          changes: suggestion.changes || [],
          summary: suggestion.summary || "",
        },
        reason: suggestion.reason || "Content analysis complete",
        priority: suggestion.priority || "medium",
        status: "pending",
      };

      const result = await db.insert(updateSuggestions)
        .values(formattedSuggestion)
        .returning();

      res.json(result[0]);
    } catch (error) {
      console.error("Content analysis error:", error);
      res.status(500).json({ error: "Failed to analyze content" });
    }
  });

  app.post("/api/content-versions/:id/compare", isAdmin, async (req, res) => {
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
  app.get("/api/test-content-generation", isAdmin, async (req, res) => {
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

  app.post("/api/content-versions/:id/translate", isAdmin, async (req, res) => {
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

  app.post("/api/language-versions/:id/validate", isAdmin, async (req, res) => {
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

  // State Localization Routes
  app.get("/api/states", async (_req, res) => {
    try {
      const allStates = await db.query.states.findMany({
        with: {
          localizations: true,
          localizationJobs: {
            orderBy: (jobs) => desc(jobs.createdAt),
            limit: 1,
          },
        },
      });
      res.json(allStates);
    } catch (error) {
      console.error("Error fetching states:", error);
      res.status(500).json({ error: "Failed to fetch states" });
    }
  });

  app.get("/api/states/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const state = await db.query.states.findFirst({
        where: eq(states.code, code.toUpperCase()),
        with: {
          localizations: {
            with: {
              contentVersion: true,
              assets: true,
            },
          },
        },
      });

      if (!state) {
        return res.status(404).json({ error: "State not found" });
      }

      res.json(state);
    } catch (error) {
      console.error("Error fetching state:", error);
      res.status(500).json({ error: "Failed to fetch state" });
    }
  });

  app.post("/api/content-versions/:id/localize", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { stateCode } = req.body;

      if (!stateCode) {
        return res.status(400).json({ error: "State code is required" });
      }

      const contentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
      });

      if (!contentVersion) {
        return res.status(404).json({ error: "Content version not found" });
      }

      // Start localization job
      const job = await aiLocalizationService.startLocalizationJob(
        stateCode,
        contentVersion.id
      );

      res.json(job);
    } catch (error) {
      console.error("Error starting localization:", error);
      res.status(500).json({ error: "Failed to start localization" });
    }
  });

  app.get("/api/localization-jobs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const job = await db.query.localizationJobs.findFirst({
        where: eq(localizationJobs.id, parseInt(id)),
        with: {
          state: true,
          contentVersion: true,
        },
      });

      if (!job) {
        return res.status(404).json({ error: "Localization job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error fetching localization job:", error);
      res.status(500).json({ error: "Failed to fetch localization job" });
    }
  });

  app.get("/api/content-versions/:id/localizations", async (req, res) => {
    try {
      const { id } = req.params;
      const localizations = await db.query.stateLocalizations.findMany({
        where: eq(stateLocalizations.contentVersionId, parseInt(id)),
        with: {
          state: true,
          assets: true,
        },
        orderBy: (loc) => loc.createdAt,
      });

      res.json(localizations);
    } catch (error) {
      console.error("Error fetching localizations:", error);
      res.status(500).json({ error: "Failed to fetch localizations" });
    }
  });

  // Batch localization endpoint
  app.post("/api/content-versions/:id/localize-batch", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { stateCodes } = req.body;

      if (!Array.isArray(stateCodes) || !stateCodes.length) {
        return res.status(400).json({ error: "State codes array is required" });
      }

      const contentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.id, parseInt(id)),
      });

      if (!contentVersion) {
        return res.status(404).json({ error: "Content version not found" });
      }

      // Start localization jobs for each state
      const jobs = await Promise.all(
        stateCodes.map((stateCode) =>
          aiLocalizationService.startLocalizationJob(stateCode, contentVersion.id)
        )
      );

      res.json(jobs);
    } catch (error) {
      console.error("Error starting batch localization:", error);
      res.status(500).json({ error: "Failed to start batch localization" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}