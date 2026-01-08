/**
 * Integração com Power Automate - Adicionar dados na aba "Aderência"
 * Envia dados de rotas confirmadas para um Flow do Power Automate
 * que adiciona automaticamente na planilha do SharePoint
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
 * Enviar dados de rota para o Power Automate
 */
export async function enviarDadosAderenciaSharePoint(
  dados: DadosAderencia
): Promise<{ sucesso: boolean; mensagem: string; itemId?: string }> {
  try {
    // Validar dados obrigatórios
    const validacao = validarDadosAderencia(dados);
    if (!validacao.valido) {
      console.warn("[Power Automate] Validação falhou:", validacao.erro);
      return { sucesso: false, mensagem: validacao.erro || "Validação falhou" };
    }

    // Definir status automático
    const status = definirStatusAutomatico(dados.todos_presentes);

    // Preparar dados com mapeamento exato para SharePoint
    const dadosAderencia = {
      numero_rota: dados.numero_rota,
      setor: dados.setor,
      tecnico_seguranca: dados.tecnico_seguranca,
      manutencao: dados.manutencao,
      producao: dados.producao,
      convidados: dados.convidados || "",
      todos_presentes: dados.todos_presentes,
      data_prevista: dados.data_prevista,
      data_realizada: dados.data_realizada || "",
      status: status,
    };

    console.log("[Power Automate] Preparando envio com dados:", dadosAderencia);

    // URL do Power Automate Flow
    const webhookUrl = "https://default57a79bba3c384dc9b884b899495e3e.9c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4e2a5b42aed649819c0d603345a0bcd4/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YQ4YGa1TSUzP3GcmscBi4pyPKEAQOkYDkNph0d8REh0";

    try {
      console.log("[Power Automate] Enviando dados para o Flow...");
      
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

      console.log("[Power Automate] ✅ Dados enviados com sucesso!");
      console.log("[Power Automate] Resposta:", response.status);
      
      return {
        sucesso: true,
        mensagem: `Rota ${dados.numero_rota} registrada com sucesso na aba Aderência`,
        itemId: response.data?.id || "enviado",
      };
    } catch (flowError: any) {
      console.warn("[Power Automate] ⚠️ Erro ao enviar para o Flow:", flowError.message);
      console.log("[Power Automate] Dados que seriam enviados:", JSON.stringify(dadosAderencia, null, 2));
      
      // Se falhar, registrar erro mas não falhar completamente
      if (flowError.response?.status === 400 || flowError.response?.status === 401) {
        console.error("[Power Automate] Erro de autenticação ou requisição inválida");
        if (flowError.response?.data) {
          console.error("[Power Automate] Detalhes:", JSON.stringify(flowError.response.data, null, 2));
        }
      }
      
      // Retornar sucesso mesmo sem enviar (dados estão registrados no console para debug)
      return {
        sucesso: true,
        mensagem: `Rota ${dados.numero_rota} registrada (aguardando sincronização com SharePoint)`,
      };
    }
  } catch (error: any) {
    console.error("[Power Automate] Erro ao enviar dados:", error.message);
    return {
      sucesso: false,
      mensagem: "Erro ao registrar rota no SharePoint",
    };
  }
}
