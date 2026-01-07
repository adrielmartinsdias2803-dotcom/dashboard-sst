/**
 * Integração com SharePoint para sincronização de dados SST
 * 
 * Este arquivo contém funções para:
 * 1. Autenticar com Microsoft Graph API
 * 2. Buscar dados da planilha Excel no SharePoint
 * 3. Processar e armazenar no banco de dados
 * 4. Sincronizar automaticamente
 */

import axios from "axios";
import { updateSSTMetrics } from "./db-sst";

interface SharePointConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  siteName: string;
  driveId: string;
  itemId: string;
}

interface SSTData {
  totalRiscos: number;
  riscosAltos: number;
  riscosMedias: number;
  riscosCriticos: number;
  acoesConcluidas: number;
  acoesPendentes: number;
}

/**
 * Obter token de acesso do Microsoft Graph
 */
async function getAccessToken(config: SharePointConfig): Promise<string> {
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
      {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("[SharePoint] Failed to get access token:", error);
    throw error;
  }
}

/**
 * Buscar dados da planilha Excel no SharePoint
 */
async function fetchExcelData(
  config: SharePointConfig,
  accessToken: string
): Promise<Record<string, unknown>> {
  try {
    const url = `https://graph.microsoft.com/v1.0/drives/${config.driveId}/items/${config.itemId}/workbook/worksheets/Sheet1/usedRange`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("[SharePoint] Failed to fetch Excel data:", error);
    throw error;
  }
}

/**
 * Processar dados da planilha e extrair métricas SST
 */
function processSSTData(excelData: Record<string, unknown>): SSTData {
  // TODO: Implementar lógica de parsing dos dados Excel
  // Este é um placeholder que retorna dados padrão
  // Você precisará adaptar conforme a estrutura real da sua planilha

  return {
    totalRiscos: 737,
    riscosAltos: 276,
    riscosMedias: 251,
    riscosCriticos: 2,
    acoesConcluidas: 290,
    acoesPendentes: 390,
  };
}

/**
 * Sincronizar dados do SharePoint com o banco de dados
 */
export async function syncSharePointData(config: SharePointConfig): Promise<void> {
  try {
    console.log("[SharePoint] Starting sync...");

    // 1. Obter token de acesso
    const accessToken = await getAccessToken(config);

    // 2. Buscar dados da planilha
    const excelData = await fetchExcelData(config, accessToken);

    // 3. Processar dados
    const sstData = processSSTData(excelData);

    // 4. Atualizar banco de dados
    await updateSSTMetrics(sstData);

    console.log("[SharePoint] Sync completed successfully");
  } catch (error) {
    console.error("[SharePoint] Sync failed:", error);
    throw error;
  }
}

/**
 * Iniciar sincronização periódica (a cada 5 minutos)
 */
export function startPeriodicSync(config: SharePointConfig, intervalMs: number = 5 * 60 * 1000): void {
  console.log(`[SharePoint] Starting periodic sync every ${intervalMs / 1000} seconds`);

  // Sincronizar imediatamente na primeira vez
  syncSharePointData(config).catch(error => {
    console.error("[SharePoint] Initial sync failed:", error);
  });

  // Depois sincronizar periodicamente
  setInterval(() => {
    syncSharePointData(config).catch(error => {
      console.error("[SharePoint] Periodic sync failed:", error);
    });
  }, intervalMs);
}
