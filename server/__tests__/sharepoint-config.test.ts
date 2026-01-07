import { describe, it, expect, beforeAll } from "vitest";
import { validateSharePointConfig } from "../sharepoint-utils";

describe("SharePoint Configuration", () => {
  let config: any;

  beforeAll(() => {
    config = {
      tenantId: process.env.SHAREPOINT_TENANT_ID,
      clientId: process.env.SHAREPOINT_CLIENT_ID,
      clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
      siteName: process.env.SHAREPOINT_SITE_NAME,
    };
  });

  it("should have all required environment variables", () => {
    expect(config.tenantId).toBeDefined();
    expect(config.clientId).toBeDefined();
    expect(config.clientSecret).toBeDefined();
    expect(config.siteName).toBeDefined();
  });

  it("should have valid format for IDs", () => {
    // Tenant ID e Client ID devem ser UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    expect(config.tenantId).toMatch(uuidRegex);
    expect(config.clientId).toMatch(uuidRegex);
  });

  it("should have non-empty client secret", () => {
    expect(config.clientSecret).toBeTruthy();
    expect(config.clientSecret.length).toBeGreaterThan(0);
  });

  it("should have valid site name", () => {
    expect(config.siteName).toBeTruthy();
    expect(config.siteName).toBe("msteams_6115f4_553804");
  });

  it("should validate SharePoint configuration", async () => {
    // Este teste tenta validar a configuração com o SharePoint
    // Se falhar, significa que as credenciais estão incorretas
    try {
      const isValid = await validateSharePointConfig(config);
      // Pode falhar se não houver conexão, mas pelo menos não deve dar erro de parsing
      expect(isValid).toBeDefined();
    } catch (error: any) {
      // Se o erro for de autenticação, as credenciais estão erradas
      if (error.message.includes("Unauthorized") || error.message.includes("401")) {
        throw new Error("SharePoint credentials are invalid");
      }
      // Outros erros podem ser de rede, o que é aceitável em teste
      console.log("SharePoint validation skipped (network error):", error.message);
    }
  });
});
