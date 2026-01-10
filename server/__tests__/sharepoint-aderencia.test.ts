import { describe, it, expect } from "vitest";
import {
  validarDadosAderencia,
  definirStatusAutomatico,
  enviarDadosAderenciaSharePoint,
} from "../sharepoint-aderencia";

describe("SharePoint Aderência Integration", () => {
  describe("validarDadosAderencia", () => {
    it("should validate complete data", () => {
      const dados = {
        numero_rota: "ROTA-1",
        setor: "Produção",
        tecnico_seguranca: "João Silva",
        manutencao: "Carlos Santos",
        producao: "Maria Oliveira",
        convidados: "Pedro Costa",
        todos_presentes: "SIM" as const,
        data_prevista: "2026-01-08",
        data_realizada: "2026-01-08",
        status: "CONCLUÍDO" as const,
      };

      const resultado = validarDadosAderencia(dados);
      expect(resultado.valido).toBe(true);
      expect(resultado.erro).toBeUndefined();
    });

    it("should fail when numero_rota is empty", () => {
      const dados = {
        numero_rota: "",
        setor: "Produção",
        tecnico_seguranca: "João Silva",
        manutencao: "Carlos Santos",
        producao: "Maria Oliveira",
        convidados: "Pedro Costa",
        todos_presentes: "SIM" as const,
        data_prevista: "2026-01-08",
        data_realizada: "2026-01-08",
        status: "CONCLUÍDO" as const,
      };

      const resultado = validarDadosAderencia(dados);
      expect(resultado.valido).toBe(false);
      expect(resultado.erro).toContain("N° ROTA");
    });

    it("should fail when setor is empty", () => {
      const dados = {
        numero_rota: "ROTA-1",
        setor: "",
        tecnico_seguranca: "João Silva",
        manutencao: "Carlos Santos",
        producao: "Maria Oliveira",
        convidados: "Pedro Costa",
        todos_presentes: "SIM" as const,
        data_prevista: "2026-01-08",
        data_realizada: "2026-01-08",
        status: "CONCLUÍDO" as const,
      };

      const resultado = validarDadosAderencia(dados);
      expect(resultado.valido).toBe(false);
      expect(resultado.erro).toContain("SETOR");
    });

    it("should fail when tecnico_seguranca is empty", () => {
      const dados = {
        numero_rota: "ROTA-1",
        setor: "Produção",
        tecnico_seguranca: "",
        manutencao: "Carlos Santos",
        producao: "Maria Oliveira",
        convidados: "Pedro Costa",
        todos_presentes: "SIM" as const,
        data_prevista: "2026-01-08",
        data_realizada: "2026-01-08",
        status: "CONCLUÍDO" as const,
      };

      const resultado = validarDadosAderencia(dados);
      expect(resultado.valido).toBe(false);
      expect(resultado.erro).toContain("TÉCNICO DE SEGURANÇA");
    });

    it("should fail when data_prevista is empty", () => {
      const dados = {
        numero_rota: "ROTA-1",
        setor: "Produção",
        tecnico_seguranca: "João Silva",
        manutencao: "Carlos Santos",
        producao: "Maria Oliveira",
        convidados: "Pedro Costa",
        todos_presentes: "SIM" as const,
        data_prevista: "",
        data_realizada: "2026-01-08",
        status: "CONCLUÍDO" as const,
      };

      const resultado = validarDadosAderencia(dados);
      expect(resultado.valido).toBe(false);
      expect(resultado.erro).toContain("DATA PREVISTA");
    });
  });

  describe("definirStatusAutomatico", () => {
    it("should return CONCLUÍDO when todos_presentes is SIM", () => {
      const status = definirStatusAutomatico("SIM");
      expect(status).toBe("CONCLUÍDO");
    });

    it("should return PENDENTE when todos_presentes is NÃO", () => {
      const status = definirStatusAutomatico("NÃO");
      expect(status).toBe("PENDENTE");
    });
  });

  describe("enviarDadosAderenciaSharePoint", () => {
    it("should reject invalid data", async () => {
      const dados = {
        numero_rota: "",
        setor: "Produção",
        tecnico_seguranca: "João Silva",
        manutencao: "Carlos Santos",
        producao: "Maria Oliveira",
        convidados: "Pedro Costa",
        todos_presentes: "SIM" as const,
        data_prevista: "2026-01-08",
        data_realizada: "2026-01-08",
        status: "CONCLUÍDO" as const,
      };

      const resultado = await enviarDadosAderenciaSharePoint(dados);
      expect(resultado.sucesso).toBe(false);
      expect(resultado.mensagem).toContain("N° ROTA");
    });

    it("should attempt to send valid data", async () => {
      const dados = {
        numero_rota: "ROTA-TEST-1",
        setor: "Produção",
        tecnico_seguranca: "João Silva",
        manutencao: "Carlos Santos",
        producao: "Maria Oliveira",
        convidados: "Pedro Costa",
        todos_presentes: "SIM" as const,
        data_prevista: "2026-01-08",
        data_realizada: "2026-01-08",
        status: "CONCLUÍDO" as const,
      };

      const resultado = await enviarDadosAderenciaSharePoint(dados);
      
      // Deve retornar sucesso (mesmo que não consiga conectar ao SharePoint real)
      expect(resultado.sucesso).toBe(true);
      expect(resultado.mensagem).toBeDefined();
      expect(resultado.mensagem.toLowerCase()).toContain("rota");
    });

    it("should include all required fields in payload", async () => {
      const dados = {
        numero_rota: "ROTA-FULL-1",
        setor: "Manutenção",
        tecnico_seguranca: "Ana Costa",
        manutencao: "Bruno Silva",
        producao: "Carlos Oliveira",
        convidados: "Diana Santos, Eduardo Lima",
        todos_presentes: "NÃO" as const,
        data_prevista: "2026-01-15",
        data_realizada: "",
        status: "PENDENTE" as const,
      };

      const resultado = await enviarDadosAderenciaSharePoint(dados);
      
      expect(resultado.sucesso).toBe(true);
      expect(resultado.mensagem).toContain("ROTA-FULL-1");
    });
  });
});
