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
}));

export const refreshSchedulesRelations = relations(refreshSchedules, ({ one }) => ({
  contentVersion: one(contentVersions, {
    fields: [refreshSchedules.contentVersionId],
    references: [contentVersions.id],
  }),
}));

export const updateSuggestionsRelations = relations(updateSuggestions, ({ one }) => ({
  contentVersion: one(contentVersions, {
    fields: [updateSuggestions.contentVersionId],
    references: [contentVersions.id],
  }),
}));

export const languageVersionsRelations = relations(languageVersions, ({ one }) => ({
  contentVersion: one(contentVersions, {
    fields: [languageVersions.contentVersionId],
    references: [contentVersions.id],
  }),
}));

// Types and Schemas
export type Template = InferModel<typeof templates>;
export type ContentVersion = InferModel<typeof contentVersions>;
export type Section = InferModel<typeof sections>;
export type Deployment = InferModel<typeof deployments>;
export type Asset = InferModel<typeof assets>;
export type RefreshSchedule = InferModel<typeof refreshSchedules>;
export type UpdateSuggestion = InferModel<typeof updateSuggestions>;
export type LanguageVersion = InferModel<typeof languageVersions>;
export type Lead = InferModel<typeof leads>;

export const insertLeadSchema = createInsertSchema(leads);
export const selectLeadSchema = createSelectSchema(leads);
export type InsertLead = typeof leads.$inferInsert;
export type SelectLead = typeof leads.$inferSelect;

export const insertContentVersionSchema = createInsertSchema(contentVersions);
export const selectContentVersionSchema = createSelectSchema(contentVersions);
export type InsertContentVersion = typeof contentVersions.$inferInsert;
export type SelectContentVersion = typeof contentVersions.$inferSelect;

export const insertRefreshScheduleSchema = createInsertSchema(refreshSchedules);
export const selectRefreshScheduleSchema = createSelectSchema(refreshSchedules);
export type InsertRefreshSchedule = typeof refreshSchedules.$inferInsert;
export type SelectRefreshSchedule = typeof refreshSchedules.$inferSelect;

export const insertUpdateSuggestionSchema = createInsertSchema(updateSuggestions);
export const selectUpdateSuggestionSchema = createSelectSchema(updateSuggestions);
export type InsertUpdateSuggestion = typeof updateSuggestions.$inferInsert;
export type SelectUpdateSuggestion = typeof updateSuggestions.$inferSelect;

export const insertLanguageVersionSchema = createInsertSchema(languageVersions);
export const selectLanguageVersionSchema = createSelectSchema(languageVersions);
export type InsertLanguageVersion = typeof languageVersions.$inferInsert;
export type SelectLanguageVersion = typeof languageVersions.$inferSelect;

export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);
export type InsertTemplate = typeof templates.$inferInsert;
export type SelectTemplate = typeof templates.$inferSelect;

export const insertSectionSchema = createInsertSchema(sections);
export const selectSectionSchema = createSelectSchema(sections);
export type InsertSection = typeof sections.$inferInsert;
export type SelectSection = typeof sections.$inferSelect;

export const insertDeploymentSchema = createInsertSchema(deployments);
export const selectDeploymentSchema = createSelectSchema(deployments);
export type InsertDeployment = typeof deployments.$inferInsert;
export type SelectDeployment = typeof deployments.$inferSelect;

export const insertAssetSchema = createInsertSchema(assets);
export const selectAssetSchema = createSelectSchema(assets);
export type InsertAsset = typeof assets.$inferInsert;
export type SelectAsset = typeof assets.$inferSelect;