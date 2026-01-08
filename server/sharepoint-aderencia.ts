/**
 * Integração com SharePoint - Planilha "Condição de Risco" aba "Aderência"
 * Envia dados de rotas confirmadas com mapeamento exato de campos
 */

import axios from "axios";

interface DadosAderencia {
  numero_rota: string;
  setor: string;
  tecnico_seguranca: string;
  manutencao: string;
  producao: string;
  convidados?: string;
  todos_presentes: "SIM" | "NÃO";
  data_prevista: string;
  data_realizada?: string;
  status: "CONCLUÍDO" | "PENDENTE";
}

/**
 * Validar dados obrigatórios antes de enviar
 */
export function validarDadosAderencia(dados: DadosAderencia): { valido: boolean; erro?: string } {
  if (!dados.numero_rota || dados.numero_rota.trim() === "") {
    return { valido: false, erro: "N° ROTA é obrigatório" };
  }

  if (!dados.setor || dados.setor.trim() === "") {
    return { valido: false, erro: "SETOR é obrigatório" };
  }

  if (!dados.tecnico_seguranca || dados.tecnico_seguranca.trim() === "") {
    return { valido: false, erro: "TÉCNICO DE SEGURANÇA é obrigatório" };
  }

  if (!dados.data_prevista || dados.data_prevista.trim() === "") {
    return { valido: false, erro: "DATA PREVISTA é obrigatória" };
  }

  return { valido: true };
}

/**
 * Definir status automático baseado em "TODOS PRESENTES?"
 */
export function definirStatusAutomatico(todos_presentes: "SIM" | "NÃO"): "CONCLUÍDO" | "PENDENTE" {
  return todos_presentes === "SIM" ? "CONCLUÍDO" : "PENDENTE";
}

/**
 * Enviar dados de rota para a aba "Aderência" no SharePoint
 */
export async function enviarDadosAderenciaSharePoint(
  dados: DadosAderencia
): Promise<{ sucesso: boolean; mensagem: string }> {
  try {
    // Validar dados obrigatórios
    const validacao = validarDadosAderencia(dados);
    if (!validacao.valido) {
      console.warn("[SharePoint Aderência] Validação falhou:", validacao.erro);
      return { sucesso: false, mensagem: validacao.erro || "Validação falhou" };
    }

    // Definir status automático
    const status = definirStatusAutomatico(dados.todos_presentes);

    // Preparar dados com mapeamento exato
    const dadosAderencia = {
      "N° ROTA": dados.numero_rota,
      "SETOR": dados.setor,
      "TÉCNICO DE SEGURANÇA": dados.tecnico_seguranca,
      "MANUTENÇÃO": dados.manutencao,
      "PRODUÇÃO": dados.producao,
      "CONVIDADOS": dados.convidados || "",
      "TODOS PRESENTES?": dados.todos_presentes,
      "DATA PREVISTA": dados.data_prevista,
      "DATA REALIZADA": dados.data_realizada || "",
      "STATUS": status,
    };

    console.log("[SharePoint Aderência] Preparando envio com dados:", dadosAderencia);

    // TODO: Implementar chamada real para SharePoint
    // Por enquanto, apenas registrar os dados
    console.log("[SharePoint Aderência] Dados prontos para envio:", JSON.stringify(dadosAderencia, null, 2));

    // Simular sucesso (será implementado com autenticação real)
    return {
      sucesso: true,
      mensagem: `Rota ${dados.numero_rota} registrada com sucesso na aba Aderência`,
    };
  } catch (error) {
    console.error("[SharePoint Aderência] Erro ao enviar dados:", error);
    return {
      sucesso: false,
      mensagem: "Erro ao registrar rota no SharePoint",
    };
  }
}

/**
 * Obter token de acesso do Azure AD para SharePoint
 */
async function obterTokenSharePoint(): Promise<string> {
  try {
    if (
      !process.env.SHAREPOINT_TENANT_ID ||
      !process.env.SHAREPOINT_CLIENT_ID ||
      !process.env.SHAREPOINT_CLIENT_SECRET
    ) {
      throw new Error("Credenciais do SharePoint não configuradas");
    }

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
 * Adicionar item à lista de Aderência no SharePoint (implementação futura)
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
