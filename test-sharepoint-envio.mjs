#!/usr/bin/env node

/**
 * Script de Teste Manual - Envio para SharePoint
 * 
 * Este script testa o envio real de dados para a aba "Aderência" no SharePoint
 * Caminho da planilha: /sites/msteams_6115f4_553804/Shared Documents/General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm
 * 
 * Uso:
 *   node test-sharepoint-envio.mjs
 */

import axios from "axios";

const config = {
  tenantId: process.env.SHAREPOINT_TENANT_ID,
  clientId: process.env.SHAREPOINT_CLIENT_ID,
  clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
  siteName: process.env.SHAREPOINT_SITE_NAME,
};

console.log("\n🔍 Teste de Envio para SharePoint - Aba Aderência\n");
console.log("📋 Configuração:");
console.log(`  Tenant ID: ${config.tenantId ? "✅ Configurado" : "❌ Não configurado"}`);
console.log(`  Client ID: ${config.clientId ? "✅ Configurado" : "❌ Não configurado"}`);
console.log(`  Client Secret: ${config.clientSecret ? "✅ Configurado" : "❌ Não configurado"}`);
console.log(`  Site Name: ${config.siteName || "❌ Não configurado"}`);
console.log(`\n📁 Caminho da planilha:`);
console.log(`  /sites/${config.siteName}/Shared Documents/General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm`);

if (!config.tenantId || !config.clientId || !config.clientSecret || !config.siteName) {
  console.log("\n❌ Credenciais não configuradas. Configure as variáveis de ambiente:");
  console.log("  - SHAREPOINT_TENANT_ID");
  console.log("  - SHAREPOINT_CLIENT_ID");
  console.log("  - SHAREPOINT_CLIENT_SECRET");
  console.log("  - SHAREPOINT_SITE_NAME");
  process.exit(1);
}

/**
 * Obter token de acesso
 */
async function obterToken() {
  console.log("\n🔐 Obtendo token de acesso...");
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
      {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      },
      { timeout: 10000 }
    );

    console.log("✅ Token obtido com sucesso");
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Erro ao obter token:", error.message);
    throw error;
  }
}

/**
 * Obter Site ID
 */
async function obterSiteId(token) {
  console.log("\n🔍 Buscando Site ID...");
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/mococa.sharepoint.com:/sites/${config.siteName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(`✅ Site ID encontrado: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error("❌ Erro ao obter Site ID:", error.message);
    throw error;
  }
}

/**
 * Obter Drive ID
 */
async function obterDriveId(token, siteId) {
  console.log("\n🔍 Buscando Drive ID...");
  try {
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
      console.log(`✅ Drive ID encontrado: ${driveId}`);
      return driveId;
    }

    throw new Error("Nenhum drive encontrado");
  } catch (error) {
    console.error("❌ Erro ao obter Drive ID:", error.message);
    throw error;
  }
}

/**
 * Obter ID do arquivo Excel
 */
async function obterIdArquivoExcel(token, driveId) {
  console.log("\n🔍 Buscando arquivo Excel na pasta específica...");
  try {
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

    console.log(`✅ Arquivo Excel encontrado: ${response.data.name}`);
    console.log(`   ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error("❌ Erro ao obter arquivo Excel:", error.message);
    throw error;
  }
}

/**
 * Listar abas do Excel
 */
async function listarAbas(token, itemId) {
  console.log("\n📋 Listando abas do Excel...");
  try {
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

    console.log(`✅ ${response.data.value.length} abas encontradas:`);
    response.data.value.forEach((aba) => {
      console.log(`  - ${aba.name} (ID: ${aba.id})`);
    });

    return response.data.value;
  } catch (error) {
    console.error("❌ Erro ao listar abas:", error.message);
    throw error;
  }
}

/**
 * Encontrar aba "Aderência"
 */
function encontrarAbaAderencia(abas) {
  console.log("\n🔍 Procurando aba 'Aderência'...");
  const aba = abas.find(
    (a) =>
      a.name?.toLowerCase() === "aderência" ||
      a.name?.toLowerCase() === "aderencia"
  );

  if (aba) {
    console.log(`✅ Aba 'Aderência' encontrada: ${aba.id}`);
    return aba;
  } else {
    console.error("❌ Aba 'Aderência' não encontrada");
    return null;
  }
}

/**
 * Listar tabelas na aba
 */
async function listarTabelas(token, itemId, abaId) {
  console.log("\n📋 Listando tabelas na aba...");
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/workbook/worksheets/${abaId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(`✅ ${response.data.value.length} tabelas encontradas:`);
    response.data.value.forEach((tabela) => {
      console.log(`  - ${tabela.name} (ID: ${tabela.id})`);
    });

    return response.data.value;
  } catch (error) {
    console.error("❌ Erro ao listar tabelas:", error.message);
    throw error;
  }
}

/**
 * Adicionar linha na tabela
 */
async function adicionarLinha(token, itemId, abaId, tabelaId) {
  console.log("\n📤 Adicionando linha na tabela...");
  try {
    const dados = [
      "ROTA-TESTE-001",
      "Produção",
      "João Silva",
      "Carlos Santos",
      "Maria Oliveira",
      "Pedro Costa",
      "SIM",
      "2026-01-08",
      "2026-01-08",
      "CONCLUÍDO",
    ];

    console.log("Dados a enviar:");
    console.log(JSON.stringify(dados, null, 2));

    const response = await axios.post(
      `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/workbook/worksheets/${abaId}/tables/${tabelaId}/rows/add`,
      {
        values: [dados],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(`✅ Linha adicionada com sucesso!`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao adicionar linha:", error.message);
    if (error.response?.data) {
      console.error("Detalhes do erro:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

/**
 * Executar teste completo
 */
async function executarTeste() {
  try {
    const token = await obterToken();
    const siteId = await obterSiteId(token);
    const driveId = await obterDriveId(token, siteId);
    const itemId = await obterIdArquivoExcel(token, driveId);
    const abas = await listarAbas(token, itemId);
    const abaAderencia = encontrarAbaAderencia(abas);

    if (!abaAderencia) {
      console.log("\n❌ Teste falhou: Aba 'Aderência' não encontrada");
      process.exit(1);
    }

    const tabelas = await listarTabelas(token, itemId, abaAderencia.id);
    
    if (tabelas.length === 0) {
      console.log("\n⚠️ Aviso: Nenhuma tabela encontrada na aba");
      console.log("Procurando por tabela nomeada 'Aderência'...");
    }

    const resultado = await adicionarLinha(token, itemId, abaAderencia.id, "Aderência");

    console.log("\n✅ Teste concluído com sucesso!");
    console.log("Dados foram enviados para o SharePoint com sucesso!");
  } catch (error) {
    console.log("\n❌ Teste falhou com erro:");
    console.error(error.message);
    process.exit(1);
  }
}

// Executar teste
executarTeste();
