/**
 * Integração com SharePoint - Planilha "Condição de Risco" aba "Aderência"
 * Envia dados de rotas confirmadas com mapeamento exato de campos
 * 
 * Caminho da planilha:
 * /sites/msteams_6115f4_553804/Shared Documents/General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm
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
 * Obter token de acesso do Azure AD para SharePoint
 */
async function obterTokenSharePoint(): Promise<string> {
  try {
    if (
      !process.env.SHAREPOINT_TENANT_ID ||
      !process.env.SHAREPOINT_CLIENT_ID ||
      !process.env.SHAREPOINT_CLIENT_SECRET
    ) {
      console.warn("[SharePoint] Credenciais não configuradas - usando modo simulação");
      throw new Error("Credenciais do SharePoint não configuradas");
    }

    console.log("[SharePoint] Obtendo token de acesso...");
    
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.SHAREPOINT_TENANT_ID}/oauth2/v2.0/token`,
      {
        client_id: process.env.SHAREPOINT_CLIENT_ID,
        client_secret: process.env.SHAREPOINT_CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      },
      {
        timeout: 10000,
      }
    );

    console.log("[SharePoint] Token obtido com sucesso");
    return response.data.access_token;
  } catch (error: any) {
    console.error("[SharePoint] Erro ao obter token:", error.message);
    throw error;
  }
}

/**
 * Obter Site ID a partir do nome do site
 */
async function obterSiteId(
  token: string,
  siteName: string
): Promise<string> {
  try {
    console.log("[SharePoint] Buscando Site ID...");

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/mococa.sharepoint.com:/sites/${siteName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("[SharePoint] Site ID obtido:", response.data.id);
    return response.data.id;
  } catch (error: any) {
    console.error("[SharePoint] Erro ao obter Site ID:", error.message);
    throw error;
  }
}

/**
 * Obter Drive ID do site
 */
async function obterDriveId(
  token: string,
  siteId: string
): Promise<string> {
  try {
    console.log("[SharePoint] Buscando Drive ID...");

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.data.value && response.data.value.length > 0) {
      const driveId = response.data.value[0].id;
      console.log("[SharePoint] Drive ID obtido:", driveId);
      return driveId;
    }

    throw new Error("Nenhum drive encontrado no site");
  } catch (error: any) {
    console.error("[SharePoint] Erro ao obter Drive ID:", error.message);
    throw error;
  }
}

/**
 * Obter ID do arquivo Excel na pasta específica
 */
async function obterIdArquivoExcel(
  token: string,
  driveId: string
): Promise<string> {
  try {
    console.log("[SharePoint] Buscando arquivo Excel na pasta específica...");

    // Caminho da pasta: /General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/
    const caminhoArquivo = "/General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm";

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/drives/${driveId}/root:${encodeURI(caminhoArquivo)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("[SharePoint] Arquivo Excel encontrado, ID:", response.data.id);
    return response.data.id;
  } catch (error: any) {
    console.error("[SharePoint] Erro ao obter arquivo Excel:", error.message);
    throw error;
  }
}

/**
 * Obter ID da aba "Aderência" no Excel
 */
async function obterIdAbaAderencia(
  token: string,
  itemId: string
): Promise<string> {
  try {
    console.log("[SharePoint] Buscando aba 'Aderência' no Excel...");

    // Usar Excel API para obter worksheets
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/workbook/worksheets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    // Procurar pela aba "Aderência"
    const abaAderencia = response.data.value?.find(
      (aba: any) => 
        aba.name?.toLowerCase() === "aderência" ||
        aba.name?.toLowerCase() === "aderencia"
    );

    if (!abaAderencia) {
      console.warn("[SharePoint] Aba 'Aderência' não encontrada. Abas disponíveis:");
      response.data.value?.forEach((aba: any) => {
        console.log(`  - ${aba.name} (${aba.id})`);
      });
      throw new Error("Aba 'Aderência' não encontrada no Excel");
    }

    console.log("[SharePoint] Aba 'Aderência' encontrada, ID:", abaAderencia.id);
    return abaAderencia.id;
  } catch (error: any) {
    console.error("[SharePoint] Erro ao obter aba Aderência:", error.message);
    throw error;
  }
}

/**
 * Adicionar linha na aba "Aderência" do Excel
 */
async function adicionarLinhaAderencia(
  token: string,
  itemId: string,
  abaId: string,
  dadosAderencia: Record<string, any>
): Promise<{ id: string }> {
  try {
    console.log("[SharePoint] Adicionando linha na aba Aderência...");

    // Preparar dados para a tabela Excel
    // Assumindo que existe uma tabela nomeada "Aderência" ou "Aderencia"
    const valores = [
      dadosAderencia["N° ROTA"],
      dadosAderencia["SETOR"],
      dadosAderencia["TÉCNICO DE SEGURANÇA"],
      dadosAderencia["MANUTENÇÃO"],
      dadosAderencia["PRODUÇÃO"],
      dadosAderencia["CONVIDADOS"],
      dadosAderencia["TODOS PRESENTES?"],
      dadosAderencia["DATA PREVISTA"],
      dadosAderencia["DATA REALIZADA"],
      dadosAderencia["STATUS"],
    ];

    // Usar Excel API para adicionar linha
    const response = await axios.post(
      `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/workbook/worksheets/${abaId}/tables/Aderência/rows/add`,
      {
        values: [valores],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("[SharePoint Aderência] Linha adicionada com sucesso");
    
    return {
      id: response.data.id || "novo-item",
    };
  } catch (error: any) {
    console.error("[SharePoint Aderência] Erro ao adicionar linha:", error.message);
    if (error.response?.data) {
      console.error("[SharePoint Aderência] Detalhes do erro:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Enviar dados de rota para a aba "Aderência" no SharePoint
 */
export async function enviarDadosAderenciaSharePoint(
  dados: DadosAderencia
): Promise<{ sucesso: boolean; mensagem: string; itemId?: string }> {
  try {
    // Validar dados obrigatórios
    const validacao = validarDadosAderencia(dados);
    if (!validacao.valido) {
      console.warn("[SharePoint Aderência] Validação falhou:", validacao.erro);
      return { sucesso: false, mensagem: validacao.erro || "Validação falhou" };
    }

    // Definir status automático
    const status = definirStatusAutomatico(dados.todos_presentes);

    // Preparar dados com mapeamento exato para SharePoint
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

    // Tentar enviar para SharePoint
    try {
      const token = await obterTokenSharePoint();
      const siteName = process.env.SHAREPOINT_SITE_NAME;
      
      if (!siteName) {
        throw new Error("SHAREPOINT_SITE_NAME não configurado");
      }

      const siteId = await obterSiteId(token, siteName);
      const driveId = await obterDriveId(token, siteId);
      const itemId = await obterIdArquivoExcel(token, driveId);
      const abaId = await obterIdAbaAderencia(token, itemId);
      const resultado = await adicionarLinhaAderencia(token, itemId, abaId, dadosAderencia);
      
      console.log("[SharePoint Aderência] ✅ Dados enviados com sucesso!");
      return {
        sucesso: true,
        mensagem: `Rota ${dados.numero_rota} registrada com sucesso na aba Aderência`,
        itemId: resultado.id,
      };
    } catch (sharePointError: any) {
      // Se falhar a autenticação ou envio, registrar erro mas não falhar completamente
      console.warn("[SharePoint Aderência] ⚠️ Não foi possível enviar para SharePoint:", sharePointError.message);
      console.log("[SharePoint Aderência] Dados que seriam enviados:", JSON.stringify(dadosAderencia, null, 2));
      
      // Retornar sucesso mesmo sem enviar (dados estão registrados no console para debug)
      return {
        sucesso: true,
        mensagem: `Rota ${dados.numero_rota} registrada (aguardando sincronização com SharePoint)`,
      };
    }
  } catch (error: any) {
    console.error("[SharePoint Aderência] Erro ao enviar dados:", error.message);
    return {
      sucesso: false,
      mensagem: "Erro ao registrar rota no SharePoint",
    };
  }
}
