import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentVersions = pgTable("content_versions", {
  id: serial("id").primaryKey(),
  drugName: text("drug_name").notNull(),
  condition: text("condition").notNull(),
  content: jsonb("content").notNull(),
  version: integer("version").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  language: text("language").notNull().default('en'),
  sourceVersionId: integer("source_version_id").references(() => contentVersions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const refreshSchedules = pgTable("refresh_schedules", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  nextRefreshDate: timestamp("next_refresh_date").notNull(),
  frequency: text("frequency").notNull(), // 'daily', 'weekly', 'monthly'
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const updateSuggestions = pgTable("update_suggestions", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  suggestedChanges: jsonb("suggested_changes").notNull(),
  reason: text("reason").notNull(),
  priority: text("priority").notNull(), // 'low', 'medium', 'high'
  status: text("status").notNull(), // 'pending', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const languageVersions = pgTable("language_versions", {
  id: serial("id").primaryKey(),
  contentVersionId: integer("content_version_id").notNull().references(() => contentVersions.id),
  language: text("language").notNull(),
  translatedContent: jsonb("translated_content").notNull(),
  lastTranslated: timestamp("last_translated").defaultNow().notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'needs_review'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations
export const contentVersionsRelations = relations(contentVersions, ({ many, one }) => ({
  refreshSchedules: many(refreshSchedules),
  updateSuggestions: many(updateSuggestions),
  languageVersions: many(languageVersions),
  sourceVersion: one(contentVersions, {
    fields: [contentVersions.sourceVersionId],
    references: [contentVersions.id],
  }),
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

// Export schemas and types
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