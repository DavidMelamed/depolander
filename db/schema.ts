import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, type InferModel } from "drizzle-orm";

// Base tables without foreign keys
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  structure: jsonb("structure").notNull(),
  defaultStyles: jsonb("default_styles"),
  phoneNumber: text("phone_number"), // Added phone number field
  deploymentConfig: jsonb("deployment_config"), // Added deployment configuration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  metadata: jsonb("metadata").notNull(), // Population, demographics, relevant statistics
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tables with foreign keys
export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  drugName: text("drug_name").notNull(),
  condition: text("condition").notNull(),
  content: jsonb("content").notNull(),
  version: integer("version").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  language: text("language").notNull().default('en'),
  sourceVersionId: integer("source_version_id").references(() => contentVersions.id),
  templateId: integer("template_id").references(() => templates.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull().references(() => templates.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  content: jsonb("content").notNull(),
  order: integer("order").notNull(),
  isEditable: boolean("is_editable").default(true).notNull(),
  styles: jsonb("styles"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const deployments = pgTable("deployments", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  domain: text("domain").notNull(),
  subdomain: text("subdomain"),
  status: text("status").notNull().default('pending'),
  configuration: jsonb("configuration").notNull(),
  analyticsId: text("analytics_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const refreshSchedules = pgTable("refresh_schedules", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  nextRefreshDate: timestamp("next_refresh_date").notNull(),
  frequency: text("frequency").notNull(),
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const updateSuggestions = pgTable("update_suggestions", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  suggestedChanges: jsonb("suggested_changes").notNull(),
  reason: text("reason").notNull(),
  priority: text("priority").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const languageVersions = pgTable("language_versions", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  language: text("language").notNull(),
  translatedContent: jsonb("translated_content").notNull(),
  lastTranslated: timestamp("last_translated").defaultNow().notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stateLocalizations = pgTable("state_localizations", {
  id: serial("id").primaryKey(),
  stateId: integer("state_id").notNull().references(() => states.id),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  localizedContent: jsonb("localized_content").notNull(),
  localStats: jsonb("local_stats").notNull(),
  seoMetadata: jsonb("seo_metadata").notNull(),
  status: text("status").notNull().default('draft'),
  publishedUrl: text("published_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stateAssets = pgTable("state_assets", {
  id: serial("id").primaryKey(),
  stateLocalizationId: integer("state_localization_id").notNull().references(() => stateLocalizations.id),
  type: text("type").notNull(),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const localizationJobs = pgTable("localization_jobs", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  stateId: integer("state_id").notNull().references(() => states.id),
  status: text("status").notNull().default('pending'),
  currentStep: text("current_step"),
  progress: integer("progress").default(0),
  error: text("error"),
  result: jsonb("result"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const templatesRelations = relations(templates, ({ many }) => ({
  sections: many(sections),
  contentVersions: many(contentVersions),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  template: one(templates, {
    fields: [sections.templateId],
    references: [templates.id],
  }),
}));

export const contentVersionsRelations = relations(contentVersions, ({ many, one }) => ({
  refreshSchedules: many(refreshSchedules),
  updateSuggestions: many(updateSuggestions),
  languageVersions: many(languageVersions),
  sourceVersion: one(contentVersions, {
    fields: [contentVersions.sourceVersionId],
    references: [contentVersions.id],
  }),
  template: one(templates, {
    fields: [contentVersions.templateId],
    references: [templates.id],
  }),
  deployments: many(deployments),
  assets: many(assets),
  stateLocalizations: many(stateLocalizations),
}));

export const statesRelations = relations(states, ({ many }) => ({
  localizations: many(stateLocalizations),
  localizationJobs: many(localizationJobs),
}));

export const stateLocalizationsRelations = relations(stateLocalizations, ({ many, one }) => ({
  state: one(states, {
    fields: [stateLocalizations.stateId],
    references: [states.id],
  }),
  contentVersion: one(contentVersions, {
    fields: [stateLocalizations.contentVersionId],
    references: [contentVersions.id],
  }),
  assets: many(stateAssets),
}));

export const stateAssetsRelations = relations(stateAssets, ({ one }) => ({
  stateLocalization: one(stateLocalizations, {
    fields: [stateAssets.stateLocalizationId],
    references: [stateLocalizations.id],
  }),
}));

export const localizationJobsRelations = relations(localizationJobs, ({ one }) => ({
  state: one(states, {
    fields: [localizationJobs.stateId],
    references: [states.id],
  }),
  contentVersion: one(contentVersions, {
    fields: [localizationJobs.contentVersionId],
    references: [contentVersions.id],
  }),
}));


// Types
export type Lead = InferModel<typeof leads>;
export type Template = InferModel<typeof templates>;
export type ContentVersion = InferModel<typeof contentVersions>;
export type Section = InferModel<typeof sections>;
export type Deployment = InferModel<typeof deployments>;
export type Asset = InferModel<typeof assets>;
export type RefreshSchedule = InferModel<typeof refreshSchedules>;
export type UpdateSuggestion = InferModel<typeof updateSuggestions>;
export type LanguageVersion = InferModel<typeof languageVersions>;
export type State = InferModel<typeof states>;
export type StateLocalization = InferModel<typeof stateLocalizations>;
export type StateAsset = InferModel<typeof stateAssets>;
export type LocalizationJob = InferModel<typeof localizationJobs>;

// Schemas
export const insertLeadSchema = createInsertSchema(leads);
export const selectLeadSchema = createSelectSchema(leads);
export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);
export const insertContentVersionSchema = createInsertSchema(contentVersions);
export const selectContentVersionSchema = createSelectSchema(contentVersions);
export const insertSectionSchema = createInsertSchema(sections);
export const selectSectionSchema = createSelectSchema(sections);
export const insertDeploymentSchema = createInsertSchema(deployments);
export const selectDeploymentSchema = createSelectSchema(deployments);
export const insertAssetSchema = createInsertSchema(assets);
export const selectAssetSchema = createSelectSchema(assets);
export const insertStateSchema = createInsertSchema(states);
export const selectStateSchema = createSelectSchema(states);
export const insertStateLocalizationSchema = createInsertSchema(stateLocalizations);
export const selectStateLocalizationSchema = createSelectSchema(stateLocalizations);
export const insertStateAssetSchema = createInsertSchema(stateAssets);
export const selectStateAssetSchema = createSelectSchema(stateAssets);
export const insertLocalizationJobSchema = createInsertSchema(localizationJobs);
export const selectLocalizationJobSchema = createSelectSchema(localizationJobs);