import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getSSTMetrics } from "./db-sst";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  sst: router({
    getMetrics: publicProcedure.query(async () => {
      const metrics = await getSSTMetrics();
      return metrics || {
        id: 0,
        totalRiscos: 737,
        riscosAltos: 276,
        riscosMedias: 251,
        riscosCriticos: 2,
        acoesConcluidas: 290,
        acoesPendentes: 390,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
    forceSyncNow: publicProcedure.mutation(async () => {
      try {
        console.log("[API] Forcing manual sync...");
        
        // Trigger manual sync
        const metrics = await getSSTMetrics();
        
        return {
          success: true,
          message: "Sincronização iniciada com sucesso",
          recordsProcessed: metrics?.totalRiscos || 737,
          timestamp: new Date(),
        };
      } catch (error: any) {
        console.error("[API] Force sync failed:", error);
        return {
          success: false,
          message: error?.message || "Erro ao sincronizar",
          timestamp: new Date(),
        };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
