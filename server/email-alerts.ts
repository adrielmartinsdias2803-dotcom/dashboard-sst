/**
 * Sistema de alertas por email para falhas de sincronização
 */

import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { alertContacts } from "../drizzle/schema";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

interface AlertData {
  status: "success" | "error";
  message: string;
  errorDetails?: string;
  recordsProcessed?: number;
  timestamp: Date;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Inicializar transporter de email
 */
function initializeEmailTransporter(config: EmailConfig): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  });

  return transporter;
}

/**
 * Obter contatos para alertas
 */
async function getAlertContacts(): Promise<string[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Cannot get alert contacts: database not available");
    return [];
  }

  try {
    const contacts = await db.select().from(alertContacts);

    return contacts.map((c) => c.email);
  } catch (error) {
    console.error("[Email] Failed to get alert contacts:", error);
    return [];
  }
}

/**
 * Gerar template de email
 */
function generateEmailTemplate(data: AlertData): string {
  const statusColor = data.status === "success" ? "#22c55e" : "#ef4444";
  const statusText = data.status === "success" ? "✓ SUCESSO" : "✗ ERRO";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #003d82; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: #f5f5f5; padding: 20px; border-radius: 0 0 5px 5px; }
          .status { 
            background: ${statusColor}; 
            color: white; 
            padding: 10px 15px; 
            border-radius: 5px; 
            font-weight: bold;
            margin-bottom: 15px;
          }
          .detail { margin: 10px 0; }
          .label { font-weight: bold; color: #003d82; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 Alerta de Sincronização SST</h2>
            <p>Dashboard de Gestão SST - Mococa</p>
          </div>
          <div class="content">
            <div class="status">${statusText}</div>
            
            <div class="detail">
              <span class="label">Mensagem:</span>
              <p>${data.message}</p>
            </div>

            ${
              data.recordsProcessed !== undefined
                ? `
              <div class="detail">
                <span class="label">Registros Processados:</span>
                <p>${data.recordsProcessed}</p>
              </div>
            `
                : ""
            }

            ${
              data.errorDetails
                ? `
              <div class="detail">
                <span class="label">Detalhes do Erro:</span>
                <p style="background: #fff; padding: 10px; border-left: 3px solid #ef4444; font-family: monospace; font-size: 12px;">
                  ${data.errorDetails.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </p>
              </div>
            `
                : ""
            }

            <div class="detail">
              <span class="label">Data/Hora:</span>
              <p>${data.timestamp.toLocaleString("pt-BR")}</p>
            </div>

            <div class="footer">
              <p>Este é um alerta automático do sistema de sincronização SST.</p>
              <p>Não responda este email. Para mais informações, acesse o dashboard.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Enviar alerta por email
 */
export async function sendAlert(
  data: AlertData,
  emailConfig?: EmailConfig
): Promise<void> {
  try {
    // Apenas enviar alertas de erro
    if (data.status === "success") {
      console.log("[Email] Success - no alert needed");
      return;
    }

    // Obter contatos
    const contacts = await getAlertContacts();
    if (contacts.length === 0) {
      console.warn("[Email] No alert contacts configured");
      return;
    }

    // Se não houver config de email, usar variáveis de ambiente
    if (!emailConfig) {
      if (
        !process.env.EMAIL_HOST ||
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS
      ) {
        console.warn("[Email] Email configuration not available");
        return;
      }

      emailConfig = {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        from: process.env.EMAIL_FROM || "noreply@mococa.com.br",
      };
    }

    // Inicializar transporter
    const transport = initializeEmailTransporter(emailConfig);

    // Enviar email para cada contato
    for (const email of contacts) {
      try {
        await transport.sendMail({
          from: emailConfig.from,
          to: email,
          subject: `🚨 Alerta SST: Falha na Sincronização`,
          html: generateEmailTemplate(data),
        });

        console.log(`[Email] Alert sent to ${email}`);
      } catch (error) {
        console.error(`[Email] Failed to send alert to ${email}:`, error);
      }
    }
  } catch (error) {
    console.error("[Email] Failed to send alerts:", error);
  }
}

/**
 * Adicionar novo contato para alertas
 */
export async function addAlertContact(
  email: string,
  name?: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Cannot add contact: database not available");
    return;
  }

  try {
    await db.insert(alertContacts).values({
      email,
      name: name || email.split("@")[0],
      isActive: 1,
    });

    console.log(`[Email] Contact added: ${email}`);
  } catch (error) {
    console.error("[Email] Failed to add contact:", error);
    throw error;
  }
}

/**
 * Listar todos os contatos de alerta
 */
export async function listAlertContacts(): Promise<
  Array<{ email: string; name: string | null; isActive: number; id: number; createdAt: Date }>
> {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Cannot list contacts: database not available");
    return [];
  }

  try {
    return await db.select().from(alertContacts);
  } catch (error) {
    console.error("[Email] Failed to list contacts:", error);
    return [];
  }
}

/**
 * Desativar contato
 */
export async function deactivateAlertContact(email: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Email] Cannot deactivate contact: database not available");
    return;
  }

  try {
    // Implementar quando tiver update do Drizzle
    console.log(`[Email] Contact deactivated: ${email}`);
  } catch (error) {
    console.error("[Email] Failed to deactivate contact:", error);
    throw error;
  }
}
