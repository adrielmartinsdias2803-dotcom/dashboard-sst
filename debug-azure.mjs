#!/usr/bin/env node

import axios from "axios";

const config = {
  tenantId: process.env.SHAREPOINT_TENANT_ID,
  clientId: process.env.SHAREPOINT_CLIENT_ID,
  clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
};

console.log("\n🔍 Debug Azure AD - Teste de Autenticação\n");
console.log("📋 Configuração:");
console.log(`  Tenant ID: ${config.tenantId}`);
console.log(`  Client ID: ${config.clientId}`);
console.log(`  Client Secret: ${config.clientSecret ? "✅ Configurado" : "❌ Não configurado"}`);

async function testarAutenticacao() {
  try {
    console.log("\n🔐 Tentando obter token do Azure AD...");
    
    const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
    const dados = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    };

    console.log("\n📤 Enviando requisição para:");
    console.log(`  URL: ${url}`);
    console.log(`  Dados:`, JSON.stringify(dados, null, 2));

    const response = await axios.post(url, new URLSearchParams(dados), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    console.log("\n✅ Token obtido com sucesso!");
    console.log(`  Access Token: ${response.data.access_token.substring(0, 50)}...`);
    console.log(`  Tipo: ${response.data.token_type}`);
    console.log(`  Expira em: ${response.data.expires_in} segundos`);

  } catch (error) {
    console.log("\n❌ Erro ao obter token:");
    console.log(`  Status: ${error.response?.status}`);
    console.log(`  Mensagem: ${error.message}`);
    
    if (error.response?.data) {
      console.log("\n📋 Detalhes do erro do Azure AD:");
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    if (error.response?.status === 400) {
      console.log("\n💡 Possíveis causas do erro 400:");
      console.log("  1. Client Secret expirado");
      console.log("  2. Client ID incorreto");
      console.log("  3. Tenant ID incorreto");
      console.log("  4. Aplicação não tem permissão para acessar Graph API");
      console.log("  5. Aplicação foi deletada ou desativada");
    }
  }
}

testarAutenticacao();
