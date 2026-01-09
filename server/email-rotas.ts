/**
 * Serviço de Email para Rotas
 * Envia notificações por email sobre rotas agendadas e confirmadas
 */

import nodemailer from "nodemailer";

interface EmailRotaData {
  numeroRota: string;
  setor: string;
  dataRota: string;
  horaRota: string;
  tecnicoSST: string;
  destinatarios: string[];
}

/**
 * Criar transportador de email
 */
function criarTransportador() {
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailHost || !emailPort || !emailUser || !emailPass) {
    console.warn("[Email] Credenciais de email não configuradas");
    return null;
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort),
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

/**
 * Enviar email de confirmação de rota
 */
export async function enviarEmailConfirmacaoRota(dados: EmailRotaData): Promise<boolean> {
  try {
    const transporter = criarTransportador();
    if (!transporter) {
      console.warn("[Email] Transportador não configurado");
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || "noreply@mococa.com.br";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Rota de Segurança Confirmada</h2>
        </div>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
          <p><strong>Número da Rota:</strong> ${dados.numeroRota}</p>
          <p><strong>Setor:</strong> ${dados.setor}</p>
          <p><strong>Data:</strong> ${dados.dataRota}</p>
          <p><strong>Hora:</strong> ${dados.horaRota}</p>
          <p><strong>Técnico de Segurança:</strong> ${dados.tecnicoSST}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Esta é uma mensagem automática. Não responda este email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: emailFrom,
      to: dados.destinatarios.join(","),
      subject: `Rota de Segurança Confirmada - ${dados.numeroRota}`,
      html: html,
    });

    console.log(`[Email] Email enviado para ${dados.destinatarios.length} destinatários`);
    return true;
  } catch (error: any) {
    console.error("[Email] Erro ao enviar email:", error.message);
    return false;
  }
}

/**
 * Enviar email de agendamento de rota
 */
export async function enviarEmailAgendamentoRota(dados: EmailRotaData): Promise<boolean> {
  try {
    const transporter = criarTransportador();
    if (!transporter) {
      console.warn("[Email] Transportador não configurado");
      return false;
    }

    const emailFrom = process.env.EMAIL_FROM || "noreply@mococa.com.br";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Nova Rota de Segurança Agendada</h2>
        </div>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Uma nova rota de segurança foi agendada:</p>
          <p><strong>Número da Rota:</strong> ${dados.numeroRota}</p>
          <p><strong>Setor:</strong> ${dados.setor}</p>
          <p><strong>Data:</strong> ${dados.dataRota}</p>
          <p><strong>Hora:</strong> ${dados.horaRota}</p>
          <p><strong>Técnico de Segurança:</strong> ${dados.tecnicoSST}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Esta é uma mensagem automática. Não responda este email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: emailFrom,
      to: dados.destinatarios.join(","),
      subject: `Nova Rota de Segurança Agendada - ${dados.numeroRota}`,
      html: html,
    });

    console.log(`[Email] Email enviado para ${dados.destinatarios.length} destinatários`);
    return true;
  } catch (error: any) {
    console.error("[Email] Erro ao enviar email:", error.message);
    return false;
  }
}
