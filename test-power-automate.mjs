#!/usr/bin/env node

/**
 * Script de Teste - Power Automate Webhook
 * 
 * Este script testa o envio de dados para o Power Automate Flow
 * que adiciona automaticamente na aba "Aderência" do SharePoint
 * 
 * Uso:
 *   node test-power-automate.mjs
 */

import axios from "axios";

const webhookUrl = "https://default57a79bba3c384dc9b884b899495e3e.9c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4e2a5b42aed649819c0d603345a0bcd4/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YQ4YGa1TSUzP3GcmscBi4pyPKEAQOkYDkNph0d8REh0";

console.log("\n🚀 Teste de Envio para Power Automate\n");
console.log("📋 Configuração:");
console.log(`  Webhook URL: ${webhookUrl.substring(0, 80)}...`);

async function testarEnvio() {
  try {
    console.log("\n📤 Preparando dados de teste...");
    
    const dadosAderencia = {
      numero_rota: "ROTA-TESTE-001",
      setor: "Produção",
      tecnico_seguranca: "João Silva",
      manutencao: "Carlos Santos",
      producao: "Maria Oliveira",
      convidados: "Pedro Costa",
      todos_presentes: "SIM",
      data_prevista: "2026-01-08",
      data_realizada: "2026-01-08",
      status: "CONCLUÍDO",
    };

    console.log("\n📋 Dados a enviar:");
    console.log(JSON.stringify(dadosAderencia, null, 2));

    console.log("\n🔐 Enviando para Power Automate...");
    
    const response = await axios.post(
      webhookUrl,
      dadosAderencia,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("\n✅ Dados enviados com sucesso!");
    console.log(`  Status: ${response.status}`);
    console.log(`  Resposta:`, JSON.stringify(response.data, null, 2));

    console.log("\n🎉 Teste concluído com sucesso!");
    console.log("\n📋 Próximos passos:");
    console.log("  1. Verifique o Power Automate para confirmar que o Flow foi executado");
    console.log("  2. Abra a planilha no SharePoint");
    console.log("  3. Vá para a aba 'Aderência'");
    console.log("  4. Procure pela rota 'ROTA-TESTE-001'");
    console.log("  5. Confirme que os dados foram adicionados corretamente");

  } catch (error) {
    console.log("\n❌ Erro ao enviar dados:");
    console.log(`  Status: ${error.response?.status}`);
    console.log(`  Mensagem: ${error.message}`);
    
    if (error.response?.data) {
      console.log("\n📋 Detalhes do erro:");
      console.log(JSON.stringify(error.response.data, null, 2));
    }

    if (error.response?.status === 400) {
      console.log("\n💡 Possíveis causas:");
      console.log("  1. Webhook URL incorreta");
      console.log("  2. Flow não está ativo");
      console.log("  3. Dados não correspondem ao esquema JSON do Flow");
    } else if (error.response?.status === 401) {
      console.log("\n💡 Possíveis causas:");
      console.log("  1. Webhook expirou");
      console.log("  2. Webhook foi regenerado");
    }

    process.exit(1);
  }
}

testarEnvio();
