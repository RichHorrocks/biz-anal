import type { GooglePlace } from "./places";

export type CompetitorContext = {
  avgRating: number | null;
  avgReviewCount: number | null;
  pctWithWebsite: number;
  pctWithPhotos: number;
  topCompetitors: Array<{
    name: string;
    rating: number | null;
    reviewCount: number | null;
  }>;
};

export function computeCompetitorContext(
  pool: GooglePlace[],
  excludePlaceId: string
): CompetitorContext {
  const peers = pool.filter((p) => p.id !== excludePlaceId);

  const rated = peers.filter((p) => p.rating !== undefined);
  const avgRating =
    rated.length > 0
      ? rated.reduce((s, p) => s + p.rating!, 0) / rated.length
      : null;

  const reviewed = peers.filter((p) => p.userRatingCount !== undefined);
  const avgReviewCount =
    reviewed.length > 0
      ? reviewed.reduce((s, p) => s + p.userRatingCount!, 0) / reviewed.length
      : null;

  const pctWithWebsite =
    peers.length > 0
      ? peers.filter((p) => p.websiteUri).length / peers.length
      : 0;

  const pctWithPhotos =
    peers.length > 0
      ? peers.filter((p) => (p.photos?.length ?? 0) > 0).length / peers.length
      : 0;

  const topCompetitors = [...peers]
    .sort((a, b) => (b.userRatingCount ?? 0) - (a.userRatingCount ?? 0))
    .slice(0, 5)
    .map((p) => ({
      name: p.displayName.text,
      rating: p.rating ?? null,
      reviewCount: p.userRatingCount ?? null,
    }));

  return { avgRating, avgReviewCount, pctWithWebsite, pctWithPhotos, topCompetitors };
}
