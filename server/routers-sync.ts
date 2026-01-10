/**
 * Rota tRPC para sincronização de dados do SharePoint
 */

import { router, publicProcedure } from "./_core/trpc";
import { sincronizarDadosSharePoint, DadosAderenciaSharePoint } from "./sharepoint-sync";

// Cache para armazenar dados sincronizados
let dadosCacheados: DadosAderenciaSharePoint[] = [];
let ultimaSincronizacao: Date | null = null;

export const syncRouter = router({
  /**
   * Sincronizar dados do SharePoint
   */
  sincronizar: publicProcedure.query(async () => {
    try {
      console.log("[tRPC Sync] Iniciando sincronização via tRPC...");
      
      const dados = await sincronizarDadosSharePoint();
      
      // Atualizar cache
      dadosCacheados = dados;
      ultimaSincronizacao = new Date();
      
      console.log(`[tRPC Sync] ✅ Sincronização concluída! ${dados.length} registros`);
      
      return {
        sucesso: true,
        total: dados.length,
        dados: dados,
        ultimaSincronizacao: ultimaSincronizacao,
      };
    } catch (error: any) {
      console.error("[tRPC Sync] Erro:", error.message);
      return {
        sucesso: false,
        total: 0,
        dados: [],
        erro: error.message,
      };
    }
  }),

  /**
   * Obter dados em cache (sem fazer nova sincronização)
   */
  obterDados: publicProcedure.query(async () => {
    return {
      sucesso: true,
      total: dadosCacheados.length,
      dados: dadosCacheados,
      ultimaSincronizacao: ultimaSincronizacao,
    };
  }),

  /**
   * Obter status da sincronização
   */
  obterStatus: publicProcedure.query(async () => {
    return {
      total: dadosCacheados.length,
      ultimaSincronizacao: ultimaSincronizacao,
      tempoDesdeUltimaSincronizacao: ultimaSincronizacao 
        ? Math.floor((Date.now() - ultimaSincronizacao.getTime()) / 1000) 
        : null,
    };
  }),

  /**
   * Buscar rota específica
   */
  buscarRota: publicProcedure
    .input((val: any) => {
      if (typeof val !== "string") throw new Error("Número da rota deve ser string");
      return val;
    })
    .query(({ input }: { input: string }) => {
      const rota = dadosCacheados.find(r => r.numero_rota === input);
      return {
        encontrada: !!rota,
        rota: rota || null,
      };
    }),

  /**
   * Filtrar rotas por setor
   */
  filtrarPorSetor: publicProcedure
    .input((val: any) => {
      if (typeof val !== "string") throw new Error("Setor deve ser string");
      return val;
    })
    .query(({ input }: { input: string }) => {
      const rotas = dadosCacheados.filter(r => r.setor === input);
      return {
        total: rotas.length,
        rotas: rotas,
      };
    }),

  /**
   * Filtrar rotas por status
   */
  filtrarPorStatus: publicProcedure
    .input((val: any) => {
      if (typeof val !== "string") throw new Error("Status deve ser string");
      return val;
    })
    .query(({ input }: { input: string }) => {
      const rotas = dadosCacheados.filter(r => r.status === input);
      return {
        total: rotas.length,
        rotas: rotas,
      };
    }),

  /**
   * Obter estatísticas
   */
  obterEstatisticas: publicProcedure.query(async () => {
    const totalRotas = dadosCacheados.length;
    const rotasConcluidas = dadosCacheados.filter(r => r.status === "CONCLUÍDO").length;
    const rotasPendentes = dadosCacheados.filter(r => r.status === "PENDENTE").length;
    
    const setoresSet = new Set(dadosCacheados.map(r => r.setor));
    const setores = Array.from(setoresSet);
    const setoresConvidados: { [key: string]: number } = {};
    
    dadosCacheados.forEach(r => {
      if (r.convidados) {
        r.convidados.split(", ").forEach(setor => {
          setoresConvidados[setor] = (setoresConvidados[setor] || 0) + 1;
        });
      }
    });

    return {
      totalRotas,
      rotasConcluidas,
      rotasPendentes,
      percentualConclusao: totalRotas > 0 ? Math.round((rotasConcluidas / totalRotas) * 100) : 0,
      setoresInspecionados: setores.length,
      setoresConvidados: Object.entries(setoresConvidados).map(([setor, count]) => ({
        setor,
        count,
      })),
    };
  }),
});
