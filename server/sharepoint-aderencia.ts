/**
 * Integração com SharePoint - Planilha "Condição de Risco" aba "Aderência"
 * Envia dados de confirmação de rotas para a planilha
 */

import axios from "axios";

interface RotaAderenciaData {
  dataRota: string;
  horaRota: string;
  setor: string;
  tecnicoSST: string;
  representanteManutenção: string;
  representanteProducao: string;
  convidados?: string;
  observacoes?: string;
  responsavelConfirmacao: string;
  dataConfirmacao: Date;
}

/**
 * Enviar dados de rota confirmada para a planilha de Aderência no SharePoint
 */
export async function enviarDadosAderenciaSharePoint(
  rotaData: RotaAderenciaData
): Promise<void> {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (
      !process.env.SHAREPOINT_SITE_NAME ||
      !process.env.SHAREPOINT_TENANT_ID ||
      !process.env.SHAREPOINT_CLIENT_ID ||
      !process.env.SHAREPOINT_CLIENT_SECRET
    ) {
      console.warn("[SharePoint Aderência] Configuração do SharePoint não disponível");
      return;
    }

    // Construir dados para enviar
    const dadosAderencia = {
      "Data da Rota": rotaData.dataRota,
      "Hora da Rota": rotaData.horaRota,
      "Setor": rotaData.setor,
      "Técnico SST": rotaData.tecnicoSST,
      "Representante Manutenção": rotaData.representanteManutenção,
      "Representante Produção": rotaData.representanteProducao,
      "Convidados": rotaData.convidados || "",
      "Observações": rotaData.observacoes || "",
      "Responsável Confirmação": rotaData.responsavelConfirmacao,
      "Data Confirmação": rotaData.dataConfirmacao.toLocaleDateString("pt-BR"),
      "Hora Confirmação": rotaData.dataConfirmacao.toLocaleTimeString("pt-BR"),
      "Status": "Confirmada",
    };

    console.log("[SharePoint Aderência] Preparando dados para envio:", dadosAderencia);

    // TODO: Implementar chamada para API do SharePoint
    // Será necessário:
    // 1. Autenticar com Azure AD
    // 2. Obter token de acesso
    // 3. Chamar Microsoft Graph API para adicionar item na lista
    // 4. Ou usar REST API do SharePoint diretamente

    console.log("[SharePoint Aderência] Dados prontos para envio (integração em desenvolvimento)");
  } catch (error) {
    console.error("[SharePoint Aderência] Erro ao enviar dados:", error);
    throw error;
  }
}

/**
 * Obter token de acesso do Azure AD para SharePoint
 */
async function obterTokenSharePoint(): Promise<string> {
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.SHAREPOINT_TENANT_ID}/oauth2/v2.0/token`,
      {
        client_id: process.env.SHAREPOINT_CLIENT_ID,
        client_secret: process.env.SHAREPOINT_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("[SharePoint] Erro ao obter token:", error);
    throw error;
  }
}

/**
 * Adicionar item à lista de Aderência no SharePoint
 */
async function adicionarItemAderencia(
  token: string,
  dadosAderencia: Record<string, any>
): Promise<void> {
  try {
    const siteId = process.env.SHAREPOINT_SITE_NAME;
    
    // Chamar Microsoft Graph API para adicionar item
    const response = await axios.post(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/Aderencia/items`,
      {
        fields: dadosAderencia,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[SharePoint Aderência] Item adicionado com sucesso:", response.data.id);
  } catch (error) {
    console.error("[SharePoint Aderência] Erro ao adicionar item:", error);
    throw error;
  }
}
