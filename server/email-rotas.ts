/**
 * Sistema de notificação por email para rotas de segurança
 */

import nodemailer from "nodemailer";

interface RotaConfirmacaoData {
  dataRota: string;
  horaRota: string;
  setor: string;
  tecnicoSST: string;
  representanteManutenção: string;
  representanteProducao: string;
  convidados?: string;
  observacoes?: string;
  responsavelConfirmacao?: string;
}

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
 * Gerar template de email de confirmação de rota
 */
function generateRotaConfirmacaoTemplate(data: RotaConfirmacaoData): string {
  const dataFormatada = new Date(data.dataRota).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f5f5f5;
          }
          .container { 
            max-width: 700px; 
            margin: 0 auto; 
            padding: 20px; 
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #003d82 0%, #0052a3 100%); 
            color: white; 
            padding: 30px 20px; 
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content { 
            padding: 30px 20px;
          }
          .status-box {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            font-weight: bold;
            text-align: center;
            font-size: 16px;
          }
          .info-section {
            margin-bottom: 25px;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #003d82;
            border-radius: 4px;
          }
          .info-section h3 {
            margin: 0 0 10px 0;
            color: #003d82;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e5e5;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #555;
            min-width: 180px;
          }
          .info-value {
            color: #333;
            text-align: right;
            flex: 1;
          }
          .participants-box {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 25px;
          }
          .participants-box h3 {
            margin: 0 0 10px 0;
            color: #1976d2;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .participant-item {
            padding: 8px 0;
            color: #333;
            border-bottom: 1px solid #bbdefb;
          }
          .participant-item:last-child {
            border-bottom: none;
          }
          .participant-item strong {
            color: #1976d2;
            display: inline-block;
            min-width: 180px;
          }
          .observations-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 25px;
          }
          .observations-box h3 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .observations-box p {
            margin: 0;
            color: #333;
            line-height: 1.6;
          }
          .cta-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f0f7ff;
            border-radius: 8px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #003d82 0%, #0052a3 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            transition: transform 0.2s;
          }
          .cta-button:hover {
            transform: scale(1.05);
          }
          .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 2px solid #e5e5e5; 
            font-size: 12px; 
            color: #999;
            text-align: center;
          }
          .footer p {
            margin: 5px 0;
          }
          .logo-section {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo-section img {
            height: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Sua Rota foi Confirmada!</h1>
            <p>Gestão Integrada de Saúde e Segurança do Trabalho - Mococa</p>
          </div>

          <div class="content">
            <div class="status-box">
              🎉 Rota agendada com sucesso e confirmada!
            </div>

            <div class="info-section">
              <h3>📅 Data e Hora</h3>
              <div class="info-row">
                <span class="info-label">Data:</span>
                <span class="info-value"><strong>${dataFormatada}</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Hora:</span>
                <span class="info-value"><strong>${data.horaRota}</strong></span>
              </div>
            </div>

            <div class="info-section">
              <h3>🏭 Setor</h3>
              <div class="info-row">
                <span class="info-label">Setor a Inspecionar:</span>
                <span class="info-value"><strong>${data.setor}</strong></span>
              </div>
            </div>

            <div class="participants-box">
              <h3>👥 Participantes da Rota</h3>
              <div class="participant-item">
                <strong>👨‍💼 Técnico SST:</strong> ${data.tecnicoSST}
              </div>
              <div class="participant-item">
                <strong>🔧 Representante Manutenção:</strong> ${data.representanteManutenção}
              </div>
              <div class="participant-item">
                <strong>🏭 Representante Produção:</strong> ${data.representanteProducao}
              </div>
              ${
                data.convidados
                  ? `<div class="participant-item">
                      <strong>👥 Convidados:</strong> ${data.convidados}
                    </div>`
                  : ""
              }
            </div>

            ${
              data.observacoes
                ? `<div class="observations-box">
                    <h3>📝 Observações Adicionais</h3>
                    <p>${data.observacoes.replace(/\n/g, "<br>")}</p>
                  </div>`
                : ""
            }

            ${
              data.responsavelConfirmacao
                ? `<div class="info-section">
                    <h3>✓ Confirmação</h3>
                    <div class="info-row">
                      <span class="info-label">Confirmado por:</span>
                      <span class="info-value"><strong>${data.responsavelConfirmacao}</strong></span>
                    </div>
                  </div>`
                : ""
            }

            <div class="cta-section">
              <p style="margin: 0 0 15px 0; color: #333;">
                A rota foi confirmada e está pronta para execução.
              </p>
              <p style="margin: 0; color: #666; font-size: 13px;">
                Certifique-se de que todos os participantes estão cientes da data e hora.
              </p>
            </div>

            <div class="footer">
              <p>Este é um email automático do Sistema de Gestão de Segurança do Trabalho - Mococa</p>
              <p>Não responda este email. Para mais informações, acesse o dashboard.</p>
              <p>© 2026 Mococa - Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Enviar email de confirmação de rota
 */
export async function sendRotaConfirmacao(
  emailDestino: string,
  rotaData: RotaConfirmacaoData,
  emailConfig?: EmailConfig
): Promise<void> {
  try {
    // Se não houver email de destino, não enviar
    if (!emailDestino || !emailDestino.includes("@")) {
      console.warn("[Email Rotas] Email inválido:", emailDestino);
      return;
    }

    // Se não houver config de email, usar variáveis de ambiente
    if (!emailConfig) {
      if (
        !process.env.EMAIL_HOST ||
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS
      ) {
        console.warn("[Email Rotas] Email configuration not available");
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

    // Enviar email
    await transport.sendMail({
      from: emailConfig.from,
      to: emailDestino,
      subject: `✅ Rota Confirmada - ${rotaData.setor} em ${rotaData.dataRota}`,
      html: generateRotaConfirmacaoTemplate(rotaData),
    });

    console.log(`[Email Rotas] Confirmação enviada para ${emailDestino}`);
  } catch (error) {
    console.error("[Email Rotas] Erro ao enviar confirmação:", error);
    throw error;
  }
}
