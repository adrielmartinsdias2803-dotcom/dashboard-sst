# 🚀 Guia Rápido - Sincronização SharePoint

## ⏱️ Tempo estimado: 15 minutos

---

## 📍 PASSO 1: Acessar Azure Portal (5 min)

1. Abra: https://portal.azure.com
2. Faça login com sua conta Microsoft 365 (mesma do Mococa)
3. No menu esquerdo, procure por **"Azure Active Directory"**
4. Clique em **"Registros de aplicativo"**

---

## 📝 PASSO 2: Criar Aplicação (3 min)

1. Clique em **"+ Novo registro"**
2. Preencha:
   - **Nome**: `Dashboard SST Mococa`
   - **Tipos de conta**: `Contas neste diretório organizacional apenas`
3. Clique em **"Registrar"**

---

## 🔑 PASSO 3: Copiar Informações Importantes (2 min)

Na página que abrir, você verá:

```
┌─────────────────────────────────────────┐
│ COPIE ESTES VALORES:                    │
├─────────────────────────────────────────┤
│ ID da Aplicação (cliente):              │
│ [XXXXXX-XXXX-XXXX-XXXX-XXXXXX]         │ ← COPIE (CLIENT_ID)
│                                         │
│ ID do Diretório (locatário):            │
│ [XXXXXX-XXXX-XXXX-XXXX-XXXXXX]         │ ← COPIE (TENANT_ID)
└─────────────────────────────────────────┘
```

---

## 🔐 PASSO 4: Criar Segredo (2 min)

1. No menu esquerdo, clique em **"Certificados e segredos"**
2. Clique em **"+ Novo segredo do cliente"**
3. Preencha:
   - **Descrição**: `SharePoint Sync`
   - **Expira em**: `24 meses`
4. Clique em **"Adicionar"**
5. **COPIE O VALOR** (aparece em azul)

```
┌─────────────────────────────────────────┐
│ COPIE ESTE VALOR:                       │
├─────────────────────────────────────────┤
│ Valor: [XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX] │ ← COPIE (CLIENT_SECRET)
│                                         │
│ ⚠️ Só aparece uma vez! Guarde bem!     │
└─────────────────────────────────────────┘
```

---

## 🔒 PASSO 5: Configurar Permissões (2 min)

1. No menu esquerdo, clique em **"Permissões de API"**
2. Clique em **"+ Adicionar uma permissão"**
3. Selecione **"Microsoft Graph"**
4. Clique em **"Permissões de aplicativo"**
5. Procure e **marque**:
   - ✅ `Files.Read.All`
   - ✅ `Sites.Read.All`
6. Clique em **"Adicionar permissões"**
7. Clique em **"Conceder consentimento do administrador"** (botão azul)

---

## 📂 PASSO 6: Encontrar IDs do SharePoint (2 min)

### Abra a planilha no SharePoint:
https://mococa.sharepoint.com/:x:/s/msteams_6115f4_553804/IQAC1WtO39XDR6XhDrcEMBqNAaEW-EuEv7JV7Io_fYzQaxs

### Copie da URL:
```
https://mococa.sharepoint.com/:x:/s/msteams_6115f4_553804/...
                                    ↑
                            SITE_NAME = msteams_6115f4_553804
```

Para DRIVE_ID e ITEM_ID, você pode usar valores padrão ou pedir ajuda técnica.

---

## ⚙️ PASSO 7: Configurar no Dashboard Manus

1. Acesse o painel de administração do seu site
2. Vá para **Settings → Secrets**
3. Adicione as seguintes variáveis:

| Variável | Valor |
|----------|-------|
| `SHAREPOINT_TENANT_ID` | Cole o ID do Diretório |
| `SHAREPOINT_CLIENT_ID` | Cole o ID da Aplicação |
| `SHAREPOINT_CLIENT_SECRET` | Cole o Segredo |
| `SHAREPOINT_SITE_NAME` | `msteams_6115f4_553804` |
| `SHAREPOINT_DRIVE_ID` | Pedir ao suporte técnico |
| `SHAREPOINT_ITEM_ID` | Pedir ao suporte técnico |

---

## ✅ Pronto!

Depois de configurar, o dashboard vai:
- 🔄 **Sincronizar automaticamente a cada 5 minutos**
- 📊 **Atualizar os indicadores em tempo real**
- 📈 **Refletir qualquer mudança na planilha**

---

## 🆘 Problemas?

### "Erro de autenticação"
- Verifique se copiou corretamente o CLIENT_SECRET
- Verifique se o consentimento foi concedido

### "Dados não atualizam"
- Aguarde 5 minutos (intervalo de sincronização)
- Verifique se a planilha foi modificada
- Verifique os logs do servidor

### "Não encontro DRIVE_ID ou ITEM_ID"
- Entre em contato com o suporte técnico
- Eles podem extrair esses valores para você

---

## 📞 Precisa de Ajuda?

Envie um email com:
1. Seus 3 valores copiados (TENANT_ID, CLIENT_ID, CLIENT_SECRET)
2. Uma print da página de permissões
3. Descrição do problema (se houver)

---

**Você conseguiu? Parabéns! 🎉**

Seu dashboard agora está sincronizado com o SharePoint em tempo real!
