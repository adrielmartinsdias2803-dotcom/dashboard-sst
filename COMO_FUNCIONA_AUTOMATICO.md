# 🤖 Como o Sistema Funciona Automaticamente

## ✅ Status: CONFIGURADO E ATIVO

Todas as credenciais foram configuradas com sucesso! Seu dashboard agora está **sincronizando automaticamente** com a planilha do SharePoint.

---

## 📊 Fluxo de Sincronização Automática

```
┌─────────────────────────────────────────────────────────────────┐
│                    CADA 5 MINUTOS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Sistema se conecta ao Azure AD                              │
│     ↓                                                            │
│  2. Obtém token de acesso                                       │
│     ↓                                                            │
│  3. Acessa SharePoint (Gestão SST_Condições de Riscos.xlsm)    │
│     ↓                                                            │
│  4. Lê os dados da planilha                                     │
│     ↓                                                            │
│  5. Processa os dados (conta riscos, ações, etc)               │
│     ↓                                                            │
│  6. Atualiza o banco de dados                                   │
│     ↓                                                            │
│  7. Registra log da sincronização                               │
│     ↓                                                            │
│  8. Se houver ERRO → Envia email de alerta                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Sincronização

### Intervalo: **5 minutos**

- ✅ Primeira sincronização: Imediatamente quando o servidor inicia
- ✅ Próximas sincronizações: A cada 5 minutos automaticamente
- ✅ Sem necessidade de intervenção manual

### O que é sincronizado:

- 📊 Total de riscos
- 🔴 Riscos Altos
- 🟡 Riscos Médios
- ⚫ Riscos Críticos
- ✓ Ações Concluídas
- ⏳ Ações Pendentes
- 📅 Data/hora da última sincronização

---

## 📧 Sistema de Alertas por Email

### Quando os alertas são enviados:

❌ **ERRO de sincronização** → Email imediato para:
- adriel.martins@mococa.com.br
- sandy.nascimento@mococa.com.br
- ednilson.vitor@mococa.com.br

✅ **SUCESSO** → Sem email (apenas registra no log)

### Conteúdo do alerta:

```
Assunto: 🚨 Alerta SST: Falha na Sincronização

Corpo:
- Status: ✗ ERRO
- Mensagem: Descrição do problema
- Detalhes do erro: Stack trace técnico
- Data/Hora: Quando ocorreu
- Registros processados: Quantos dados foram lidos
```

---

## 📍 Onde ver o histórico de sincronizações

1. **Acesse seu dashboard**: https://seu-dominio.manus.space
2. **Clique em**: "Status de Sincronização" (botão amarelo)
3. **Veja**:
   - Última sincronização
   - Frequência de atualização
   - Histórico completo de logs
   - Erros e sucessos

---

## 🔐 Credenciais Configuradas

Todas as credenciais estão **seguras** no painel Secrets:

| Credencial | Valor | Status |
|-----------|-------|--------|
| SHAREPOINT_TENANT_ID | 57a79bba-3c38-4dc9-b884-b899495e3e8c | ✅ |
| SHAREPOINT_CLIENT_ID | 7f3c51a0-9e42-441c-80b8-c41d23b22d3b | ✅ |
| SHAREPOINT_CLIENT_SECRET | ••••••••••••••••••••••••••••••••••• | ✅ |
| SHAREPOINT_SITE_NAME | msteams_6115f4_553804 | ✅ |
| EMAIL_HOST | smtp.office365.com | ✅ |
| EMAIL_PORT | 587 | ✅ |
| EMAIL_USER | adriel.martins@mococa.com.br | ✅ |
| EMAIL_PASS | ••••••••••••••••••••••••••••••••••• | ✅ |
| EMAIL_FROM | adriel.martins@mococa.com.br | ✅ |

---

## 🛠️ Troubleshooting

### "Sincronização não está funcionando"

1. **Verifique a página de Status**: `/sync-status`
2. **Veja os logs**: Qual foi o erro?
3. **Possíveis causas**:
   - ❌ Credenciais expiradas
   - ❌ Planilha foi movida/deletada
   - ❌ Permissões revogadas no Azure AD
   - ❌ Servidor de email indisponível

### "Não estou recebendo alertas"

1. **Verifique se há erros**: Vá em Status de Sincronização
2. **Verifique spam**: Os emails podem estar na pasta de spam
3. **Teste manual**: Envie um email de teste para confirmar que o servidor SMTP funciona

### "Preciso forçar uma sincronização agora"

- Clique em **"Sincronizar Agora"** na página de Status
- Ou reinicie o servidor (vai sincronizar imediatamente)

---

## 📈 Dados em Tempo Real

Seu dashboard **atualiza automaticamente** quando:

1. ✅ Você modifica a planilha no SharePoint
2. ✅ Aguarda até 5 minutos (próxima sincronização)
3. ✅ Dashboard mostra os novos dados

**Exemplo**:
- 14:00 - Você adiciona um novo risco na planilha
- 14:05 - Dashboard sincroniza e mostra o novo risco
- 14:10 - Próxima sincronização automática

---

## 🎯 Próximos Passos (Opcional)

### 1. Customizar o parsing de dados
Se a estrutura da sua planilha for diferente, você pode editar:
```
server/sharepoint-sync.ts → função processSSTData()
```

### 2. Alterar frequência de sincronização
Para sincronizar a cada 1 minuto em vez de 5:
```
server/_core/index.ts → startPeriodicSync(config, 1 * 60 * 1000)
```

### 3. Adicionar mais contatos para alertas
Acesse o banco de dados e adicione emails na tabela `alert_contacts`

---

## 📞 Suporte

Se algo não funcionar:

1. **Verifique os logs**: Página de Status de Sincronização
2. **Reinicie o servidor**: Às vezes resolve
3. **Verifique as credenciais**: Elas podem ter expirado
4. **Entre em contato com TI**: Se o problema for de rede/email

---

## ✨ Resumo

✅ **Sistema está 100% configurado e ativo**
✅ **Sincronização automática a cada 5 minutos**
✅ **Alertas por email configurados**
✅ **Dashboard atualiza em tempo real**
✅ **Histórico de sincronizações disponível**

**Você não precisa fazer mais nada! Tudo funciona sozinho! 🎉**
