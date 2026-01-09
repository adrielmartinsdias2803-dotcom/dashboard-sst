/**
 * Sincronização com SharePoint - Ler dados da aba Aderência
 * Busca dados da planilha e sincroniza com o Dashboard
 */

import axios from "axios";

export interface DadosAderenciaSharePoint {
  numero_rota: string;
  setor: string;
  tecnico_seguranca: string;
  manutencao: string;
  producao: string;
  convidados: string;
  todos_presentes: string;
  data_prevista: string;
  data_realizada: string;
  status: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

/**
 * Obter token de acesso do Azure AD
 */
async function obterTokenSharePoint(): Promise<string> {
  // Verificar se token está em cache e ainda válido
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const tenantId = process.env.SHAREPOINT_TENANT_ID;
  const clientId = process.env.SHAREPOINT_CLIENT_ID;
  const clientSecret = process.env.SHAREPOINT_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Credenciais do SharePoint não configuradas");
  }

  try {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const response = await axios.post<TokenResponse>(
      url,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000,
      }
    );

    // Armazenar token em cache com tempo de expiração
    tokenCache = {
      token: response.data.access_token,
      expiresAt: Date.now() + response.data.expires_in * 1000 - 60000, // Expirar 1 min antes
    };

    return response.data.access_token;
  } catch (error: any) {
    console.error("[SharePoint Sync] Erro ao obter token:", error.message);
    throw error;
  }
}

/**
 * Obter ID do site
 */
async function obterSiteId(token: string): Promise<string> {
  const siteName = process.env.SHAREPOINT_SITE_NAME;

  if (!siteName) {
    throw new Error("SHAREPOINT_SITE_NAME não configurado");
  }

  try {
    const url = `https://graph.microsoft.com/v1.0/sites?search=${siteName}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    if (!response.data.value || response.data.value.length === 0) {
      throw new Error(`Site "${siteName}" não encontrado`);
    }

    return response.data.value[0].id;
  } catch (error: any) {
    console.error("[SharePoint Sync] Erro ao obter site ID:", error.message);
    throw error;
  }
}

/**
 * Obter ID do Drive
 */
async function obterDriveId(token: string, siteId: string): Promise<string> {
  try {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    if (!response.data.value || response.data.value.length === 0) {
      throw new Error("Nenhum drive encontrado no site");
    }

    return response.data.value[0].id;
  } catch (error: any) {
    console.error("[SharePoint Sync] Erro ao obter drive ID:", error.message);
    throw error;
  }
}

/**
 * Obter ID do arquivo Excel
 */
async function obterIdArquivoExcel(token: string, driveId: string): Promise<string> {
  const caminhoArquivo = "/General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm";

  try {
    const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:${encodeURI(caminhoArquivo)}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    return response.data.id;
  } catch (error: any) {
    console.error("[SharePoint Sync] Erro ao obter arquivo Excel:", error.message);
    throw error;
  }
}

/**
 * Obter ID da aba Aderência
 */
async function obterIdAbaAderencia(token: string, siteId: string, itemId: string): Promise<string> {
  try {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/workbook/worksheets`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    const abaAderencia = response.data.value.find(
      (aba: any) => aba.name.toLowerCase() === "aderência" || aba.name.toLowerCase() === "aderencia"
    );

    if (!abaAderencia) {
      throw new Error("Aba 'Aderência' não encontrada");
    }

    return abaAderencia.id;
  } catch (error: any) {
    console.error("[SharePoint Sync] Erro ao obter aba:", error.message);
    throw error;
  }
}

/**
 * Buscar dados da tabela Aderência
 */
async function buscarDadosAderencia(
  token: string,
  siteId: string,
  itemId: string,
  abaId: string
): Promise<DadosAderenciaSharePoint[]> {
  try {
    // Buscar a tabela "Aderência"
    const urlTabelas = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/workbook/worksheets/${abaId}/tables`;
    const responseTabelas = await axios.get(urlTabelas, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    const tabela = responseTabelas.data.value.find((t: any) => t.name === "Aderência");
    if (!tabela) {
      console.warn("[SharePoint Sync] Tabela 'Aderência' não encontrada");
      return [];
    }

    // Buscar linhas da tabela
    const urlLinhas = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/workbook/tables/${tabela.id}/rows`;
    const responseLinhas = await axios.get(urlLinhas, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });

    // Mapear dados
    const dados: DadosAderenciaSharePoint[] = responseLinhas.data.value.map((linha: any) => {
      const valores = linha.values[0];
      return {
        numero_rota: String(valores[0] || ""),
        setor: String(valores[1] || ""),
        tecnico_seguranca: String(valores[2] || ""),
        manutencao: String(valores[3] || ""),
        producao: String(valores[4] || ""),
        convidados: String(valores[5] || ""),
        todos_presentes: String(valores[6] || ""),
        data_prevista: String(valores[7] || ""),
        data_realizada: String(valores[8] || ""),
        status: String(valores[9] || ""),
      };
    });

    return dados;
  } catch (error: any) {
    console.error("[SharePoint Sync] Erro ao buscar dados:", error.message);
    return [];
  }
}

/**
 * Sincronizar dados do SharePoint
 */
export async function sincronizarDadosSharePoint(): Promise<DadosAderenciaSharePoint[]> {
  try {
    console.log("[SharePoint Sync] Iniciando sincronização...");

    // Obter token
    const token = await obterTokenSharePoint();

    // Obter IDs
    const siteId = await obterSiteId(token);
    const driveId = await obterDriveId(token, siteId);
    const itemId = await obterIdArquivoExcel(token, driveId);
    const abaId = await obterIdAbaAderencia(token, siteId, itemId);

    // Buscar dados
    const dados = await buscarDadosAderencia(token, siteId, itemId, abaId);

    console.log(`[SharePoint Sync] ✅ Sincronização concluída! ${dados.length} registros encontrados`);
    return dados;
  } catch (error: any) {
    console.error("[SharePoint Sync] ❌ Erro na sincronização:", error.message);
    return [];
  }
}

/**
 * Sincronizar periodicamente (a cada 5 minutos)
 */
export function iniciarSincronizacaoPeriodica() {
  console.log("[SharePoint Sync] Iniciando sincronização periódica (a cada 5 minutos)");
  
  // Sincronizar imediatamente
  sincronizarDadosSharePoint();

  // Sincronizar a cada 5 minutos
  setInterval(() => {
    sincronizarDadosSharePoint();
  }, 5 * 60 * 1000);
}
