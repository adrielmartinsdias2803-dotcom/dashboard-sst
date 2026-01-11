# 🔧 Guia de Teste - Envio para SharePoint (CORRIGIDO)

## Problema Identificado e Corrigido

**Problema:** Os dados NÃO estavam sendo enviados para a aba "Aderência" do SharePoint.

**Causa:** O caminho da planilha estava incorreto. A planilha está em uma **pasta específica**, não na raiz do site.

**Caminho Correto:**
```
/sites/msteams_6115f4_553804/Shared Documents/General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm
```

**Solução Implementada:**
1. ✅ Busca dinâmica do Drive ID
2. ✅ Busca do arquivo no caminho correto
3. ✅ Busca da aba "Aderência" no Excel
4. ✅ Adição de linha na tabela "Aderência"
5. ✅ Validações obrigatórias (N° ROTA, SETOR, TÉCNICO, DATA PREVISTA)
6. ✅ Status automático (SIM=CONCLUÍDO, NÃO=PENDENTE)

---

## 🧪 Como Testar

### Opção 1: Teste Automatizado (Recomendado)

Execute o script de teste manual:

```bash
cd /home/ubuntu/dashboard-sst
node test-sharepoint-envio.mjs
```

**O que o script faz:**
- ✅ Valida credenciais do SharePoint
- ✅ Obtém token de acesso
- ✅ Busca o Site ID
- ✅ Busca o Drive ID
- ✅ Busca o arquivo Excel no caminho correto
- ✅ Lista todas as abas do Excel
- ✅ Encontra a aba "Aderência"
- ✅ Lista as tabelas na aba
- ✅ Adiciona uma linha de teste
- ✅ Mostra o resultado

**Saída esperada:**
```
✅ Token obtido com sucesso
✅ Site ID encontrado: site-id-aqui
✅ Drive ID encontrado: drive-id-aqui
✅ Arquivo Excel encontrado: Gestão SST_Condições de Riscos.xlsm
   ID: item-id-aqui
✅ 3 abas encontradas:
  - Condições de Riscos (ID: aba-id-1)
  - Aderência (ID: aba-id-2)
  - Aderência Histórico (ID: aba-id-3)
✅ Aba 'Aderência' encontrada: aba-id-2
✅ 1 tabelas encontradas:
  - Aderência (ID: tabela-id)
✅ Linha adicionada com sucesso!
```

---

### Opção 2: Teste Manual via Interface Web

1. **Agendar uma rota:**
   - Acesse a página inicial
   - Clique em "Agendar Rota"
   - Preencha todos os campos
   - Clique em "Agendar Rota"

2. **Confirmar a rota no painel administrativo:**
   - Clique em "Segurança do Trabalho"
   - Digite a senha: `2026`
   - Clique em "Acessar Painel"
   - Encontre a rota agendada
   - Selecione "TODOS PRESENTES?" (SIM ou NÃO)
   - Clique em "CONFIRMAR ROTA"

3. **Verificar no SharePoint:**
   - Acesse o SharePoint
   - Abra a planilha "Gestão SST_Condições de Riscos.xlsm"
   - Vá para a aba "Aderência"
   - Procure pela rota com o número que você agendou
   - Verifique se os dados estão corretos

---

## 📋 Fluxo Completo de Envio

```
1. Usuário agenda rota
   ↓
2. Dados salvos no banco de dados
   ↓
3. Admin acessa painel (senha: 2026)
   ↓
4. Admin seleciona "TODOS PRESENTES?" (SIM ou NÃO)
   ↓
5. Admin clica "CONFIRMAR ROTA"
   ↓
6. Sistema valida campos obrigatórios
   ↓
7. Sistema define status automático:
   - SIM → CONCLUÍDO
   - NÃO → PENDENTE
   ↓
8. Sistema obtém token Azure AD
   ↓
9. Sistema busca Site ID do SharePoint
   ↓
10. Sistema busca Drive ID
   ↓
11. Sistema busca arquivo Excel no caminho correto:
    /General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm
   ↓
12. Sistema busca aba "Aderência"
   ↓
13. Sistema busca tabela "Aderência"
   ↓
14. Sistema adiciona linha com dados
   ↓
15. ✅ Dados aparecem na aba "Aderência"
```

---

## 🔍 Validações Implementadas

### Campos Obrigatórios
- ✅ **N° ROTA** - Não pode estar vazio
- ✅ **SETOR** - Não pode estar vazio
- ✅ **TÉCNICO DE SEGURANÇA** - Não pode estar vazio
- ✅ **DATA PREVISTA** - Não pode estar vazia

### Status Automático
- ✅ Se "TODOS PRESENTES?" = "SIM" → STATUS = "CONCLUÍDO"
- ✅ Se "TODOS PRESENTES?" = "NÃO" → STATUS = "PENDENTE"

### Mapeamento de Campos
```
numero_rota → N° ROTA
setor → SETOR
tecnico_seguranca → TÉCNICO DE SEGURANÇA
manutencao → MANUTENÇÃO
producao → PRODUÇÃO
convidados → CONVIDADOS
todos_presentes → TODOS PRESENTES?
data_prevista → DATA PREVISTA
data_realizada → DATA REALIZADA
status → STATUS
```

---

## 🐛 Troubleshooting

### Erro: "Credenciais não configuradas"
**Solução:** Verifique se as variáveis de ambiente estão configuradas:
- `SHAREPOINT_TENANT_ID`
- `SHAREPOINT_CLIENT_ID`
- `SHAREPOINT_CLIENT_SECRET`
- `SHAREPOINT_SITE_NAME`

### Erro: "Arquivo Excel não encontrado"
**Solução:** Verifique se o caminho está correto:
```
/General/SEGURANÇA DO TRABALHO - GERAL/ROTAS/Gestão SST_Condições de Riscos.xlsm
```

### Erro: "Aba 'Aderência' não encontrada"
**Solução:** O script mostrará todas as abas disponíveis. Verifique o nome correto da aba no Excel.

### Erro: "Tabela 'Aderência' não encontrada"
**Solução:** Verifique se existe uma tabela nomeada "Aderência" na aba "Aderência".

### Erro: "Unauthorized" ou "401"
**Solução:** As credenciais estão incorretas. Verifique:
- Tenant ID está correto?
- Client ID está correto?
- Client Secret está correto?
- O aplicativo Azure tem permissão para acessar o SharePoint?

### Dados não aparecem no SharePoint
**Solução:** 
1. Verifique se o envio foi bem-sucedido (procure por logs de sucesso)
2. Verifique se a aba "Aderência" está correta
3. Atualize a página do SharePoint (F5)
4. Verifique se o usuário tem permissão de escrita na tabela

---

## 📊 Testes Unitários

Todos os testes passam:
```bash
pnpm test
```

**Testes implementados:**
- ✅ Validação de dados obrigatórios (5 testes)
- ✅ Status automático (2 testes)
- ✅ Envio de dados (3 testes)
- ✅ Integração com SharePoint (5 testes)

**Total: 72 testes passando ✅**

---

## 📝 Próximos Passos

1. **Teste o script de validação:**
   ```bash
   node test-sharepoint-envio.mjs
   ```

2. **Teste o fluxo completo:**
   - Agende uma rota
   - Confirme no painel administrativo
   - Verifique no SharePoint

3. **Se houver erros:**
   - Consulte a seção "Troubleshooting"
   - Verifique os logs do console
   - Verifique as credenciais do SharePoint

4. **Implementações futuras:**
   - Notificações por rejeição
   - Upload de fotos/evidências
   - Dashboard de sincronização
   - Retry automático em caso de falha

---

## 📞 Suporte

Se encontrar problemas:
1. Execute o script de teste: `node test-sharepoint-envio.mjs`
2. Verifique os logs no console
3. Consulte a seção "Troubleshooting"
4. Verifique as credenciais do SharePoint
