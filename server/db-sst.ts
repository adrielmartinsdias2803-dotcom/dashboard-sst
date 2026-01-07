import { eq } from "drizzle-orm";
import { sstMetrics, InsertSSTMetrics, SSTMetrics } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Obter as métricas atuais de SST
 */
export async function getSSTMetrics(): Promise<SSTMetrics | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get SST metrics: database not available");
    return null;
  }

  try {
    const result = await db.select().from(sstMetrics).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get SST metrics:", error);
    throw error;
  }
}

/**
 * Atualizar ou criar as métricas de SST
 */
export async function updateSSTMetrics(metrics: InsertSSTMetrics): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update SST metrics: database not available");
    return;
  }

  try {
    const existing = await getSSTMetrics();

    if (existing) {
      // Atualizar registro existente
      await db
        .update(sstMetrics)
        .set({
          totalRiscos: metrics.totalRiscos,
          riscosAltos: metrics.riscosAltos,
          riscosMedias: metrics.riscosMedias,
          riscosCriticos: metrics.riscosCriticos,
          acoesConcluidas: metrics.acoesConcluidas,
          acoesPendentes: metrics.acoesPendentes,
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(sstMetrics.id, existing.id));
    } else {
      // Criar novo registro
      await db.insert(sstMetrics).values({
        totalRiscos: metrics.totalRiscos || 0,
        riscosAltos: metrics.riscosAltos || 0,
        riscosMedias: metrics.riscosMedias || 0,
        riscosCriticos: metrics.riscosCriticos || 0,
        acoesConcluidas: metrics.acoesConcluidas || 0,
        acoesPendentes: metrics.acoesPendentes || 0,
        lastSyncedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("[Database] Failed to update SST metrics:", error);
    throw error;
  }
}
