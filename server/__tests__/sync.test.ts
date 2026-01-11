import { describe, it, expect, beforeEach, vi } from "vitest";
import { sincronizarDadosSharePoint } from "../sharepoint-sync";

describe("SharePoint Sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export sincronizarDadosSharePoint function", () => {
    expect(typeof sincronizarDadosSharePoint).toBe("function");
  });

  it("should return an array of dados", async () => {
    const resultado = await sincronizarDadosSharePoint();
    expect(Array.isArray(resultado)).toBe(true);
  });

  it("should handle missing credentials gracefully", async () => {
    // Temporariamente remover credenciais
    const originalTenantId = process.env.SHAREPOINT_TENANT_ID;
    delete process.env.SHAREPOINT_TENANT_ID;

    try {
      const resultado = await sincronizarDadosSharePoint();
      expect(Array.isArray(resultado)).toBe(true);
    } finally {
      // Restaurar credenciais
      if (originalTenantId) {
        process.env.SHAREPOINT_TENANT_ID = originalTenantId;
      }
    }
  });

  it("should return dados with expected structure", async () => {
    const resultado = await sincronizarDadosSharePoint();
    
    if (resultado.length > 0) {
      const primeiroItem = resultado[0];
      
      expect(primeiroItem).toHaveProperty("numero_rota");
      expect(primeiroItem).toHaveProperty("setor");
      expect(primeiroItem).toHaveProperty("tecnico_seguranca");
      expect(primeiroItem).toHaveProperty("status");
    }
  });

  it("should handle errors without throwing", async () => {
    // Esta função deve sempre retornar um array, mesmo em caso de erro
    const resultado = await sincronizarDadosSharePoint();
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado).toBeDefined();
  });
});
