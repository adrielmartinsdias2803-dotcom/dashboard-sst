import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, date, time, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const sstMetrics = mysqlTable("sst_metrics", {
  id: int("id").autoincrement().primaryKey(),
  totalRiscos: int("total_riscos").default(0).notNull(),
  riscosAltos: int("riscos_altos").default(0).notNull(),
  riscosMedias: int("riscos_medias").default(0).notNull(),
  riscosCriticos: int("riscos_criticos").default(0).notNull(),
  acoesConcluidas: int("acoes_concluidas").default(0).notNull(),
  acoesPendentes: int("acoes_pendentes").default(0).notNull(),
  lastSyncedAt: timestamp("last_synced_at").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SSTMetrics = typeof sstMetrics.$inferSelect;
export type InsertSSTMetrics = typeof sstMetrics.$inferInsert;

export const syncLogs = mysqlTable("sync_logs", {
  id: int("id").autoincrement().primaryKey(),
  status: mysqlEnum("status", ["success", "error", "pending"]).notNull(),
  message: text("message"),
  errorDetails: text("error_details"),
  recordsProcessed: int("records_processed").default(0),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SyncLog = typeof syncLogs.$inferSelect;
export type InsertSyncLog = typeof syncLogs.$inferInsert;

export const alertContacts = mysqlTable("alert_contacts", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  isActive: tinyint("is_active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AlertContact = typeof alertContacts.$inferSelect;
export type InsertAlertContact = typeof alertContacts.$inferInsert;
export const rotasAgendadas = mysqlTable("rotas_agendadas", {
  id: int("id").autoincrement().primaryKey(),
  dataRota: date("data_rota").notNull(),
  horaRota: time("hora_rota").notNull(),
  setor: varchar("setor", { length: 255 }).notNull(),
  tecnicoSST: varchar("tecnico_sst", { length: 255 }).notNull(),
  representanteManutenção: varchar("representante_manutencao", { length: 255 }).notNull(),
  representanteProducao: varchar("representante_producao", { length: 255 }).notNull(),
  convidados: text("convidados"),
  observacoes: text("observacoes"),
  status: mysqlEnum("status", ["pendente", "confirmada", "concluida", "cancelada"]).default("pendente").notNull(),
  responsavelConfirmacao: varchar("responsavel_confirmacao", { length: 255 }),
  dataConfirmacao: timestamp("data_confirmacao"),
  observacoesConfirmacao: text("observacoes_confirmacao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RotaAgendada = typeof rotasAgendadas.$inferSelect;
export type InsertRotaAgendada = typeof rotasAgendadas.$inferInsert;
