import { createTRPCContext, createCallerFactory } from "@/server/trpc";
import { appRouter } from "@/server/root";

const createCaller = createCallerFactory(appRouter);

export const trpcServer = async () => {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
};
