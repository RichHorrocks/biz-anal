import crypto from "crypto";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { textSearch } from "@/lib/places";
import { computeCompetitorContext } from "@/lib/competitor";
import { getOrSet } from "@/lib/cache";
import { db } from "@/db";
import { searches, businesses, competitorContexts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const searchRouter = createTRPCRouter({
  run: protectedProcedure
    .input(
      z.object({
        location: z.string().min(1),
        category: z.string().min(1),
        radius: z.number().default(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { location, category, radius } = input;
      const textQuery = `${category} in ${location}`;
      const cacheKey = `places:search:${crypto
        .createHash("md5")
        .update(textQuery)
        .digest("hex")}`;

      const places = await getOrSet(cacheKey, 86400, () => textSearch(textQuery));

      const [search] = await db
        .insert(searches)
        .values({ userId: ctx.userId, query: textQuery, location, category, radius })
        .returning();

      const businessRows = await db
        .insert(businesses)
        .values(
          places.map((p) => ({
            searchId: search.id,
            placeId: p.id,
            name: p.displayName.text,
            primaryType: p.primaryTypeDisplayName?.text ?? p.primaryType ?? null,
            rating: p.rating ?? null,
            reviewCount: p.userRatingCount ?? null,
            websiteUri: p.websiteUri ?? null,
            phone: p.nationalPhoneNumber ?? null,
            address: p.formattedAddress ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            photosCount: p.photos?.length ?? 0,
            hoursJson: p.regularOpeningHours ?? null,
            rawJson: p as Record<string, unknown>,
          }))
        )
        .returning();

      const contextRows = await db
        .insert(competitorContexts)
        .values(
          businessRows.map((b) => {
            const cc = computeCompetitorContext(places, b.placeId);
            return {
              businessId: b.id,
              avgRating: cc.avgRating,
              avgReviewCount: cc.avgReviewCount,
              pctWithWebsite: cc.pctWithWebsite,
              pctWithPhotos: cc.pctWithPhotos,
              topCompetitorsJson: cc.topCompetitors,
            };
          })
        )
        .returning();

      return {
        searchId: search.id,
        businesses: businessRows.map((b) => {
          const cc = contextRows.find((c) => c.businessId === b.id);
          return { ...b, competitorContext: cc ?? null };
        }),
      };
    }),

  getResults: protectedProcedure
    .input(z.object({ searchId: z.string().uuid() }))
    .query(async ({ input }) => {
      const results = await db.query.businesses.findMany({
        where: eq(businesses.searchId, input.searchId),
        with: { competitorContexts: true },
      });
      return results;
    }),

  recentSearches: protectedProcedure.query(async ({ ctx }) => {
    const results = await db.query.searches.findMany({
      where: eq(searches.userId, ctx.userId),
      orderBy: (s, { desc }) => [desc(s.createdAt)],
      limit: 10,
    });
    return results;
  }),
});
