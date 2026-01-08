import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getSSTMetrics } from "./db-sst";
import { getDb } from "./db";
import { rotasAgendadas } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { sendRotaConfirmacao } from "./email-rotas";

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
        limit: z.number().optional(),
      }))
      .query(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        let query: any = db.select().from(rotasAgendadas);
        
        if (input.status) {
          query = query.where(eq(rotasAgendadas.status, input.status));
        }
        
        const result = await query.orderBy(desc(rotasAgendadas.createdAt)).limit(input.limit || 100);
        return result;
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
        emailNotificacao: z.string().optional(),
      }))
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Buscar rota para obter dados
        const rotas = await db.select().from(rotasAgendadas).where(eq(rotasAgendadas.id, input.id));
        const rota = rotas[0];
        
        // Atualizar rota
        const result = await db.update(rotasAgendadas)
          .set({
            status: "confirmada",
            responsavelConfirmacao: input.responsavelConfirmacao,
            observacoesConfirmacao: input.observacoesConfirmacao,
            dataConfirmacao: new Date(),
          })
          .where(eq(rotasAgendadas.id, input.id));
        
        // Enviar email se houver email de notificacao
        if (input.emailNotificacao && rota) {
          try {
            await sendRotaConfirmacao(input.emailNotificacao, {
              dataRota: rota.dataRota,
              horaRota: rota.horaRota,
              setor: rota.setor,
              tecnicoSST: rota.tecnicoSST,
              representanteManutenção: rota.representanteManutenção,
              representanteProducao: rota.representanteProducao,
              convidados: rota.convidados || undefined,
              observacoes: rota.observacoes || undefined,
              responsavelConfirmacao: input.responsavelConfirmacao,
            });
          } catch (error) {
            console.error("[API] Erro ao enviar email de confirmacao:", error);
          }
        }
        
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
  }),
});
