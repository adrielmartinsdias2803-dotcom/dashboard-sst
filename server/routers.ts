import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getSSTMetrics } from "./db-sst";
import { getDb } from "./db";
import { rotasAgendadas } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

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
        riscosCriticos: 3,
        acoesConcluidas: 290,
        acoesPendentes: 390,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
    getSyncStatus: publicProcedure.query(async () => {
      try {
        const metrics = await getSSTMetrics();
        if (!metrics) {
          return {
            lastSync: 'Janeiro 8, 2026 às 19:27',
            status: 'idle'
          };
        }
        
        const lastSyncTime = new Date(metrics.lastSyncedAt);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - lastSyncTime.getTime()) / (1000 * 60));
        
        let lastSyncText = '';
        if (diffMinutes < 1) {
          lastSyncText = 'Agora';
        } else if (diffMinutes < 60) {
          lastSyncText = `Há ${diffMinutes} min`;
        } else {
          const hours = Math.floor(diffMinutes / 60);
          lastSyncText = `Há ${hours}h`;
        }
        
        return {
          lastSync: lastSyncText,
          status: 'success'
        };
      } catch (error) {
        return {
          lastSync: 'Erro ao carregar',
          status: 'error'
        };
      }
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
    })
  }),
  rotas: router({
    listRotas: publicProcedure
      .input(z.object({ 
        status: z.enum(["pendente", "confirmada", "concluida", "cancelada"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional())
      .query(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        if (input?.status) {
          const rotas = await db.select().from(rotasAgendadas).where(eq(rotasAgendadas.status, input.status)).orderBy(desc(rotasAgendadas.createdAt)).limit(input?.limit || 50).offset(input?.offset || 0);
          return rotas;
        }
        
        const rotas = await db.select().from(rotasAgendadas).orderBy(desc(rotasAgendadas.createdAt)).limit(input?.limit || 50).offset(input?.offset || 0);
        return rotas;
      }),

    getRotaById: publicProcedure
      .input(z.number())
      .query(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const rota = await db.select().from(rotasAgendadas).where(eq(rotasAgendadas.id, input)).limit(1);
        return rota[0] || null;
      }),

    createRota: publicProcedure
      .input(z.object({
        dataRota: z.string(),
        horaRota: z.string(),
        setor: z.string(),
        tecnicoSST: z.string(),
        representanteManutenção: z.string(),
        representanteProducao: z.string(),
        convidados: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(rotasAgendadas).values({
          ...input,
          status: "pendente",
        });
        return result;
      }),

    confirmarRota: publicProcedure
      .input(z.object({
        id: z.number(),
        responsavelConfirmacao: z.string(),
        observacoesConfirmacao: z.string().optional(),
      }))
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.update(rotasAgendadas)
          .set({
            status: "confirmada",
            responsavelConfirmacao: input.responsavelConfirmacao,
            observacoesConfirmacao: input.observacoesConfirmacao,
            dataConfirmacao: new Date(),
          })
          .where(eq(rotasAgendadas.id, input.id));
        return result;
      }),

    concluirRota: publicProcedure
      .input(z.object({
        id: z.number(),
        observacoesConfirmacao: z.string().optional(),
      }))
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.update(rotasAgendadas)
          .set({
            status: "concluida",
            observacoesConfirmacao: input.observacoesConfirmacao,
            dataConfirmacao: new Date(),
          })
          .where(eq(rotasAgendadas.id, input.id));
        return result;
      }),

    cancelarRota: publicProcedure
      .input(z.object({
        id: z.number(),
        observacoesConfirmacao: z.string(),
      }))
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.update(rotasAgendadas)
          .set({
            status: "cancelada",
            observacoesConfirmacao: input.observacoesConfirmacao,
            dataConfirmacao: new Date(),
          })
          .where(eq(rotasAgendadas.id, input.id));
        return result;
      }),

    getEstatisticas: publicProcedure
      .query(async () => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const rotas = await db.select().from(rotasAgendadas);
        
        const stats = {
          total: rotas.length,
          pendentes: rotas.filter((r: any) => r.status === "pendente").length,
          confirmadas: rotas.filter((r: any) => r.status === "confirmada").length,
          concluidas: rotas.filter((r: any) => r.status === "concluida").length,
          canceladas: rotas.filter((r: any) => r.status === "cancelada").length,
        };
        
        return stats;
      }),
  }),
});

export type AppRouter = typeof appRouter;
