import {
  pgTable,
  text,
  integer,
  real,
  timestamp,
  jsonb,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const searches = pgTable("searches", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  query: text("query").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  radius: integer("radius").default(5000),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const searchesRelations = relations(searches, ({ many }) => ({
  businesses: many(businesses),
}));

export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    searchId: uuid("search_id").references(() => searches.id, { onDelete: "cascade" }),
    placeId: text("place_id").notNull(),
    name: text("name").notNull(),
    primaryType: text("primary_type"),
    rating: real("rating"),
    reviewCount: integer("review_count"),
    websiteUri: text("website_uri"),
    phone: text("phone"),
    address: text("address"),
    lat: real("lat"),
    lng: real("lng"),
    hoursJson: jsonb("hours_json"),
    photosCount: integer("photos_count").default(0),
    rawJson: jsonb("raw_json"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("businesses_place_id_idx").on(t.placeId)]
);

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  search: one(searches, { fields: [businesses.searchId], references: [searches.id] }),
  competitorContexts: many(competitorContexts),
  signals: many(signals),
  opportunityScores: many(opportunityScores),
}));

export const competitorContexts = pgTable("competitor_contexts", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  avgRating: real("avg_rating"),
  avgReviewCount: real("avg_review_count"),
  pctWithWebsite: real("pct_with_website"),
  pctWithPhotos: real("pct_with_photos"),
  topCompetitorsJson: jsonb("top_competitors_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const competitorContextsRelations = relations(competitorContexts, ({ one }) => ({
  business: one(businesses, {
    fields: [competitorContexts.businessId],
    references: [businesses.id],
  }),
}));

export const signals = pgTable(
  "signals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    value: text("value"),
    detail: text("detail"),
    opportunity: text("opportunity"),
    pitch: text("pitch"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("signals_business_id_idx").on(t.businessId)]
);

export const signalsRelations = relations(signals, ({ one }) => ({
  business: one(businesses, { fields: [signals.businessId], references: [businesses.id] }),
}));

export const opportunityScores = pgTable("opportunity_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  tier: text("tier").notNull(),
  breakdownJson: jsonb("breakdown_json"),
  recommendationsJson: jsonb("recommendations_json"),
  generatedPitch: text("generated_pitch"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const opportunityScoresRelations = relations(opportunityScores, ({ one }) => ({
  business: one(businesses, {
    fields: [opportunityScores.businessId],
    references: [businesses.id],
  }),
}));
