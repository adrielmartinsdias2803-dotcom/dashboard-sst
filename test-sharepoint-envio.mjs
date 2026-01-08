#!/usr/bin/env node

/**
 * Script de Teste Manual - Envio para SharePoint
 * 
 * Este script testa o envio real de dados para a aba "Aderência" no SharePoint
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
 * Listar listas do site
 */
async function listarListas(token, siteId) {
  console.log("\n📋 Listando listas do site...");
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(`✅ ${response.data.value.length} listas encontradas:`);
    response.data.value.forEach((lista) => {
      console.log(`  - ${lista.displayName} (ID: ${lista.id})`);
    });

    return response.data.value;
  } catch (error) {
    console.error("❌ Erro ao listar listas:", error.message);
    throw error;
  }
}

/**
 * Encontrar lista "Aderência"
 */
function encontrarListaAderencia(listas) {
  console.log("\n🔍 Procurando lista 'Aderência'...");
  const lista = listas.find(
    (l) =>
      l.displayName?.toLowerCase() === "aderência" ||
      l.displayName?.toLowerCase() === "aderencia" ||
      l.name?.toLowerCase() === "aderência" ||
      l.name?.toLowerCase() === "aderencia"
  );

  if (lista) {
    console.log(`✅ Lista 'Aderência' encontrada: ${lista.id}`);
    return lista;
  } else {
    console.error("❌ Lista 'Aderência' não encontrada");
    return null;
  }
}

/**
 * Enviar dados para a lista
 */
async function enviarDados(token, siteId, listaId) {
  console.log("\n📤 Enviando dados para a lista...");
  try {
    const dados = {
      "N° ROTA": "ROTA-TESTE-001",
      "SETOR": "Produção",
      "TÉCNICO DE SEGURANÇA": "João Silva",
      "MANUTENÇÃO": "Carlos Santos",
      "PRODUÇÃO": "Maria Oliveira",
      "CONVIDADOS": "Pedro Costa",
      "TODOS PRESENTES?": "SIM",
      "DATA PREVISTA": "2026-01-08",
      "DATA REALIZADA": "2026-01-08",
      "STATUS": "CONCLUÍDO",
    };

    console.log("Dados a enviar:");
    console.log(JSON.stringify(dados, null, 2));

    const response = await axios.post(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listaId}/items`,
      {
        fields: dados,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(`✅ Dados enviados com sucesso!`);
    console.log(`  Item ID: ${response.data.id}`);
    console.log(`  Web URL: ${response.data.webUrl || "N/A"}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao enviar dados:", error.message);
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
    const listas = await listarListas(token, siteId);
    const listaAderencia = encontrarListaAderencia(listas);

    if (!listaAderencia) {
      console.log("\n❌ Teste falhou: Lista 'Aderência' não encontrada");
      process.exit(1);
    }

    const resultado = await enviarDados(token, siteId, listaAderencia.id);

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
