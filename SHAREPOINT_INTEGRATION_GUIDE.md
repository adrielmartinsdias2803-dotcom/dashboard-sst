# Guia de Integração com SharePoint - Sincronização em Tempo Real

## 📋 Visão Geral

Este guia explica como configurar a sincronização automática da planilha SST do SharePoint com o dashboard em tempo real.

---

## 🔧 Pré-requisitos

1. **Acesso ao Microsoft 365 / Azure AD** com permissões de administrador
2. **Planilha Excel no SharePoint** (já existe: `Gestão SST_Condições de Riscos.xlsm`)
3. **Aplicação registrada no Azure AD** para autenticação

---

## 📝 Passo 1: Registrar Aplicação no Azure AD

### 1.1 Acessar Azure Portal
- Vá para: https://portal.azure.com
- Faça login com sua conta Microsoft 365

### 1.2 Registrar Nova Aplicação
1. No menu lateral, clique em **Azure Active Directory**
2. Clique em **Registros de aplicativo**
3. Clique em **+ Novo registro**
4. Preencha os dados:
   - **Nome**: `Dashboard SST Mococa`
   - **Tipos de conta suportados**: Contas neste diretório organizacional apenas
   - **URI de redirecionamento**: `http://localhost:3000/api/oauth/callback`
5. Clique em **Registrar**

### 1.3 Criar Segredo do Cliente
1. Na página da aplicação, clique em **Certificados e segredos**
2. Clique em **+ Novo segredo do cliente**
3. Preencha:
   - **Descrição**: `SharePoint Sync Secret`
   - **Expira em**: Selecione um período (ex: 24 meses)
4. Clique em **Adicionar**
5. **Copie o valor do segredo** (não será possível copiar depois)

### 1.4 Configurar Permissões de API
1. Na página da aplicação, clique em **Permissões de API**
2. Clique em **+ Adicionar uma permissão**
3. Selecione **Microsoft Graph**
4. Clique em **Permissões de aplicativo**
5. Procure e adicione as seguintes permissões:
   - `Files.Read.All` - Ler arquivos
   - `Sites.Read.All` - Ler sites SharePoint
6. Clique em **Adicionar permissões**
7. Clique em **Conceder consentimento do administrador para [sua organização]**

### 1.5 Copiar Informações Necessárias
Na página de visão geral da aplicação, copie:
- **ID da Aplicação (cliente)** - será seu `CLIENT_ID`
- **ID do Diretório (locatário)** - será seu `TENANT_ID`

---

## 📍 Passo 2: Obter Informações do SharePoint

### 2.1 Encontrar o Site ID
1. Acesse seu SharePoint: https://mococa.sharepoint.com
2. Abra a biblioteca onde está a planilha
3. Na barra de endereço, copie a URL
4. Use esta API para obter o Site ID:

```bash
curl -X GET "https://graph.microsoft.com/v1.0/sites/mococa.sharepoint.com:/sites/msteams_6115f4_553804" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2.2 Encontrar o Drive ID e Item ID
```bash
# Listar drives do site
curl -X GET "https://graph.microsoft.com/v1.0/sites/{SITE_ID}/drives" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Listar itens do drive
curl -X GET "https://graph.microsoft.com/v1.0/drives/{DRIVE_ID}/root/children" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env` (ou configure no painel de Secrets do Manus):

```env
SHAREPOINT_TENANT_ID=seu-tenant-id
SHAREPOINT_CLIENT_ID=seu-client-id
SHAREPOINT_CLIENT_SECRET=seu-client-secret
SHAREPOINT_SITE_NAME=msteams_6115f4_553804
SHAREPOINT_DRIVE_ID=seu-drive-id
SHAREPOINT_ITEM_ID=seu-item-id
```

---

## 💻 Passo 4: Implementar Sincronização

### 4.1 Arquivo: `server/sharepoint-sync.ts`

Este arquivo já contém as funções base. Você precisa:

1. **Implementar o parsing dos dados Excel**:

```typescript
function processSSTData(excelData: Record<string, unknown>): SSTData {
  // excelData contém as linhas da planilha
  // Processe conforme a estrutura da sua planilha
  
  // Exemplo:
  const rows = excelData.values as any[][];
  
  let totalRiscos = 0;
  let riscosAltos = 0;
  let riscosMedias = 0;
  let riscosCriticos = 0;
  let acoesConcluidas = 0;
  let acoesPendentes = 0;
  
  rows.forEach((row, index) => {
    if (index === 0) return; // Pular cabeçalho
    
    const severidade = row[2]; // Coluna de severidade
    const status = row[5]; // Coluna de status
    
    totalRiscos++;
    
    if (severidade === "Alto") riscosAltos++;
    if (severidade === "Médio") riscosMedias++;
    if (severidade === "Crítico") riscosCriticos++;
    
    if (status === "Concluído") acoesConcluidas++;
    else if (status === "A iniciar") acoesPendentes++;
  });
  
  return {
    totalRiscos,
    riscosAltos,
    riscosMedias,
    riscosCriticos,
    acoesConcluidas,
    acoesPendentes,
  };
}
```

### 4.2 Inicializar Sincronização no Servidor

No arquivo `server/_core/index.ts`, adicione:

```typescript
import { startPeriodicSync } from "../sharepoint-sync";

// Após inicializar o servidor
if (process.env.SHAREPOINT_TENANT_ID) {
  startPeriodicSync({
    tenantId: process.env.SHAREPOINT_TENANT_ID,
    clientId: process.env.SHAREPOINT_CLIENT_ID,
    clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
    siteName: process.env.SHAREPOINT_SITE_NAME,
    driveId: process.env.SHAREPOINT_DRIVE_ID,
    itemId: process.env.SHAREPOINT_ITEM_ID,
  }, 5 * 60 * 1000); // Sincronizar a cada 5 minutos
}
```

---

## 🧪 Passo 5: Testar a Integração

### 5.1 Teste Manual
```bash
# No diretório do projeto
pnpm dev

# Em outro terminal, teste a API
curl http://localhost:3000/api/trpc/sst.getMetrics
```

### 5.2 Teste de Sincronização
1. Modifique a planilha no SharePoint
2. Aguarde até 5 minutos (ou o intervalo configurado)
3. Verifique se os dados foram atualizados no dashboard

---

## 📊 Passo 6: Usar Dados Sincronizados no Frontend

O frontend já está pronto para usar os dados. No arquivo `client/src/pages/Home.tsx`:

```typescript
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: metricsData, isLoading } = trpc.sst.getMetrics.useQuery();
  
  useEffect(() => {
    if (metricsData) {
      setMetrics(metricsData);
    }
  }, [metricsData]);
  
  // ... resto do componente
}
```

---

## 🔄 Fluxo de Sincronização

```
SharePoint Excel
       ↓
Microsoft Graph API
       ↓
Processamento de Dados
       ↓
Banco de Dados MySQL
       ↓
API tRPC (sst.getMetrics)
       ↓
Frontend React (Atualização Automática)
```

---

## ⚙️ Configuração Avançada

### Alterar Frequência de Sincronização

No `server/_core/index.ts`:
```typescript
// Sincronizar a cada 1 minuto
startPeriodicSync(config, 1 * 60 * 1000);

// Sincronizar a cada 30 minutos
startPeriodicSync(config, 30 * 60 * 1000);
```

### Sincronização via Webhook (Opcional)

Para sincronização verdadeiramente em tempo real, você pode usar webhooks do SharePoint:

```typescript
// Criar webhook
POST https://graph.microsoft.com/v1.0/subscriptions

{
  "changeType": "updated",
  "notificationUrl": "https://seu-dominio.com/api/webhooks/sharepoint",
  "resource": "/drives/{DRIVE_ID}/root",
  "expirationDateTime": "2026-01-07T00:00:00Z"
}
```

---

## 🐛 Troubleshooting

### Erro: "Unauthorized"
- Verifique se o `CLIENT_SECRET` está correto
- Verifique se as permissões foram concedidas no Azure AD

### Erro: "File not found"
- Verifique se o `ITEM_ID` está correto
- Certifique-se de que a planilha ainda existe no SharePoint

### Dados não atualizam
- Verifique os logs do servidor: `pnpm dev`
- Aumente a frequência de sincronização para testar
- Verifique se o banco de dados está acessível

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Consulte a documentação do Microsoft Graph: https://docs.microsoft.com/graph
3. Verifique a estrutura da sua planilha Excel

---

## ✅ Checklist de Implementação

- [ ] Aplicação registrada no Azure AD
- [ ] Segredo do cliente criado
- [ ] Permissões de API configuradas
- [ ] Site ID, Drive ID e Item ID obtidos
- [ ] Variáveis de ambiente configuradas
- [ ] Função `processSSTData` implementada
- [ ] Sincronização inicializada no servidor
- [ ] Testes manuais realizados
- [ ] Dashboard atualiza com dados do SharePoint

---

**Data de Criação**: Janeiro 2026  
**Última Atualização**: Janeiro 2026
