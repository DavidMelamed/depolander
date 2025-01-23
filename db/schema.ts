import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, type InferModel } from "drizzle-orm";

// Add admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default('admin'),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add color schemes table
export const colorSchemes = pgTable("color_schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  primary: text("primary").notNull(),
  secondary: text("secondary").notNull(),
  background: text("background").notNull(),
  text: text("text").notNull(),
  accent: text("accent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add landing pages table
export const landingPages = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  colorSchemeId: integer("color_scheme_id").references(() => colorSchemes.id),
  content: jsonb("content").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Base tables without foreign keys
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  details: text("details"),
  landingPageId: integer("landing_page_id").references(() => landingPages.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  structure: jsonb("structure").notNull(),
  defaultStyles: jsonb("default_styles"),
  phoneNumber: text("phone_number"),
  deploymentConfig: jsonb("deployment_config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  metadata: jsonb("metadata").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tables with foreign keys
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

// Define relations
export const sectionsRelations = relations(sections, ({ one }) => ({
  template: one(templates, {
    fields: [sections.templateId],
    references: [templates.id],
  }),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  sections: many(sections),
  contentVersions: many(contentVersions),
}));

export const landingPagesRelations = relations(landingPages, ({ one }) => ({
  colorScheme: one(colorSchemes, {
    fields: [landingPages.colorSchemeId],
    references: [colorSchemes.id],
  }),
}));

// Types
export type Lead = InferModel<typeof leads>;
export type Template = InferModel<typeof templates>;
export type ContentVersion = InferModel<typeof contentVersions>;
export type Section = InferModel<typeof sections>;
export type AdminUser = InferModel<typeof adminUsers>;
export type ColorScheme = InferModel<typeof colorSchemes>;
export type LandingPage = InferModel<typeof landingPages>;

// Schemas
export const insertLeadSchema = createInsertSchema(leads);
export const selectLeadSchema = createSelectSchema(leads);
export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);
export const insertContentVersionSchema = createInsertSchema(contentVersions);
export const selectContentVersionSchema = createSelectSchema(contentVersions);
export const insertSectionSchema = createInsertSchema(sections);
export const selectSectionSchema = createSelectSchema(sections);
export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const selectAdminUserSchema = createSelectSchema(adminUsers);
export const insertColorSchemeSchema = createInsertSchema(colorSchemes);
export const selectColorSchemeSchema = createSelectSchema(colorSchemes);
export const insertLandingPageSchema = createInsertSchema(landingPages);
export const selectLandingPageSchema = createSelectSchema(landingPages);