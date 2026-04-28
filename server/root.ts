import { createTRPCRouter } from "./trpc";
import { healthRouter } from "./routers/health";
import { searchRouter } from "./routers/search";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
