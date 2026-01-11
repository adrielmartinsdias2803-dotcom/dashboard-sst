/**
 * Utilitários para extrair informações do SharePoint
 */

import axios from "axios";

interface SharePointConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  siteName: string;
}

interface SharePointIds {
  siteId: string;
  driveId: string;
  itemId: string;
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
 * Extrair Site ID a partir do nome do site
 */
async function getSiteId(
  config: SharePointConfig,
  accessToken: string
): Promise<string> {
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/mococa.sharepoint.com:/sites/${config.siteName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error("[SharePoint] Failed to get site ID:", error);
    throw error;
  }
}

/**
 * Extrair Drive ID do site
 */
async function getDriveId(
  siteId: string,
  accessToken: string
): Promise<string> {
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Retorna o primeiro drive (geralmente o padrão)
    if (response.data.value && response.data.value.length > 0) {
      return response.data.value[0].id;
    }

    throw new Error("No drives found");
  } catch (error) {
    console.error("[SharePoint] Failed to get drive ID:", error);
    throw error;
  }
}

/**
 * Extrair Item ID da planilha Excel
 */
async function getItemId(
  driveId: string,
  fileName: string,
  accessToken: string
): Promise<string> {
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/drives/${driveId}/root/children`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Procura pelo arquivo Excel
    const file = response.data.value.find(
      (item: any) =>
        item.name.toLowerCase().includes("gestão") &&
        item.name.toLowerCase().includes("sst") &&
        (item.name.endsWith(".xlsx") || item.name.endsWith(".xlsm"))
    );

    if (!file) {
      throw new Error(`File not found: ${fileName}`);
    }

    return file.id;
  } catch (error) {
    console.error("[SharePoint] Failed to get item ID:", error);
    throw error;
  }
}

/**
 * Extrair todos os IDs necessários automaticamente
 */
export async function extractSharePointIds(
  config: SharePointConfig
): Promise<SharePointIds> {
  try {
    console.log("[SharePoint] Extracting IDs...");

    // 1. Obter token
    const accessToken = await getAccessToken(config);

    // 2. Obter Site ID
    const siteId = await getSiteId(config, accessToken);
    console.log("[SharePoint] Site ID:", siteId);

    // 3. Obter Drive ID
    const driveId = await getDriveId(siteId, accessToken);
    console.log("[SharePoint] Drive ID:", driveId);

    // 4. Obter Item ID
    const itemId = await getItemId(
      driveId,
      "Gestão SST_Condições de Riscos.xlsm",
      accessToken
    );
    console.log("[SharePoint] Item ID:", itemId);

    return {
      siteId,
      driveId,
      itemId,
    };
  } catch (error) {
    console.error("[SharePoint] Failed to extract IDs:", error);
    throw error;
  }
}

/**
 * Validar configuração do SharePoint
 */
export async function validateSharePointConfig(
  config: SharePointConfig
): Promise<boolean> {
  try {
    await extractSharePointIds(config);
    return true;
  } catch (error) {
    console.error("[SharePoint] Configuration validation failed:", error);
    return false;
  }
}
