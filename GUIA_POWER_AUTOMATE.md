# 🚀 Guia Passo a Passo - Power Automate Flow

## Objetivo
Criar um Flow que recebe dados via HTTP e adiciona automaticamente na planilha "Gestão SST_Condições de Riscos.xlsm" na aba "Aderência".

---

## 📋 Passo 1: Acessar Power Automate

1. Abra o navegador
2. Acesse: **https://make.powerautomate.com**
3. Faça login com sua conta Microsoft (a mesma do SharePoint)
4. Clique em **"Criar"** no menu esquerdo

---

## 📋 Passo 2: Criar um Novo Flow

1. Clique em **"Nuvem instantânea"** (Cloud flows)
2. Selecione **"Acionado por nuvem"** (Cloud triggered)
3. Escolha **"Quando uma solicitação HTTP é recebida"** (When a HTTP request is received)
4. Clique em **"Criar"**

---

## 📋 Passo 3: Configurar o Gatilho HTTP

Na seção **"Quando uma solicitação HTTP é recebida"**:

1. Clique em **"Usar um esquema de exemplo"**
2. Cole o JSON abaixo no campo "Esquema JSON":

```json
{
  "type": "object",
  "properties": {
    "numero_rota": {
      "type": "string"
    },
    "setor": {
      "type": "string"
    },
    "tecnico_seguranca": {
      "type": "string"
    },
    "manutencao": {
      "type": "string"
    },
    "producao": {
      "type": "string"
    },
    "convidados": {
      "type": "string"
    },
    "todos_presentes": {
      "type": "string"
    },
    "data_prevista": {
      "type": "string"
    },
    "data_realizada": {
      "type": "string"
    },
    "status": {
      "type": "string"
    }
  }
}
```

3. Clique em **"Salvar"** (você verá a URL do webhook gerada)
4. **Copie a URL do webhook** - você vai precisar dela!

---

## 📋 Passo 4: Adicionar Ação - Adicionar Linha na Tabela

1. Clique em **"+ Nova etapa"** (New step)
2. Procure por **"Excel Online (Business)"**
3. Selecione **"Adicionar uma linha em uma tabela"** (Add a row into a table)

---

## 📋 Passo 5: Configurar a Ação do Excel

Na seção **"Adicionar uma linha em uma tabela"**:

1. **Localização**: Selecione seu site do SharePoint (mococa.sharepoint.com)
2. **Biblioteca de Documentos**: Selecione **"Shared Documents"** (ou o local onde está a planilha)
3. **Arquivo**: Procure e selecione **"Gestão SST_Condições de Riscos.xlsm"**
4. **Tabela**: Selecione **"Aderência"**

---

## 📋 Passo 6: Mapear os Campos

Após selecionar a tabela, você verá os campos disponíveis. Mapeie assim:

| Campo da Tabela | Valor do Flow |
|---|---|
| N° ROTA | numero_rota |
| SETOR | setor |
| TÉCNICO DE SEGURANÇA | tecnico_seguranca |
| MANUTENÇÃO | manutencao |
| PRODUÇÃO | producao |
| CONVIDADOS | convidados |
| TODOS PRESENTES? | todos_presentes |
| DATA PREVISTA | data_prevista |
| DATA REALIZADA | data_realizada |
| STATUS | status |

**Como mapear:**
1. Clique no campo de entrada de cada coluna
2. Selecione o campo correspondente da lista dinâmica (você verá os campos do JSON que configurou)
3. Repita para todos os campos

---

## 📋 Passo 7: Adicionar Resposta HTTP (Opcional)

Para confirmar que o Flow funcionou:

1. Clique em **"+ Nova etapa"**
2. Procure por **"Responder a uma solicitação HTTP"** (Respond to a HTTP request)
3. Configure assim:
   - **Código de Status**: 200
   - **Corpo**: 
   ```json
   {
     "sucesso": true,
     "mensagem": "Dados adicionados com sucesso na aba Aderência"
   }
   ```

---

## 📋 Passo 8: Salvar o Flow

1. Clique em **"Salvar"** no canto superior direito
2. Dê um nome ao Flow, por exemplo: **"Adicionar Rota na Aderência"**
3. Clique em **"Salvar"** novamente

---

## 📋 Passo 9: Copiar a URL do Webhook

1. Volte para a primeira etapa **"Quando uma solicitação HTTP é recebida"**
2. Você verá a **URL do POST** (HTTP POST URL)
3. **Copie essa URL** - você vai usar no código

Exemplo de URL:
```
https://prod-12.westus.logic.azure.com:443/workflows/abc123/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xyz123
```

---

## ✅ Pronto!

Agora você tem:
- ✅ Um Flow criado no Power Automate
- ✅ Uma URL de webhook para enviar dados
- ✅ Mapeamento dos campos configurado
- ✅ Resposta HTTP configurada

**Próximo passo:** Forneça a URL do webhook para que eu configure o código para enviar dados para lá!

---

## 🧪 Como Testar o Flow

### Teste 1: Testar no Power Automate

1. Abra o Flow que você criou
2. Clique em **"Testar"** no canto superior direito
3. Selecione **"Usar dados de exemplo"** ou **"Manualmente"**
4. Preencha os dados de teste
5. Clique em **"Executar"**
6. Verifique se os dados foram adicionados na planilha

### Teste 2: Testar via Script

Depois que fornecer a URL do webhook, vou criar um script para testar:

```bash
curl -X POST "https://sua-url-do-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "numero_rota": "ROTA-001",
    "setor": "Produção",
    "tecnico_seguranca": "João Silva",
    "manutencao": "Carlos Santos",
    "producao": "Maria Oliveira",
    "convidados": "Pedro Costa",
    "todos_presentes": "SIM",
    "data_prevista": "2026-01-08",
    "data_realizada": "2026-01-08",
    "status": "CONCLUÍDO"
  }'
```

---

## 🐛 Troubleshooting

### Erro: "Tabela não encontrada"
**Solução:** Verifique se a tabela "Aderência" existe na aba "Aderência" da planilha.

### Erro: "Campo não mapeado"
**Solução:** Verifique se o nome do campo no Excel corresponde ao nome que você está mapeando.

### Erro: "Arquivo não encontrado"
**Solução:** Verifique se o arquivo está em "Shared Documents" e não em outra pasta.

### Erro: "Sem permissão"
**Solução:** Verifique se sua conta tem permissão de escrita na planilha.

---

## 📞 Próximos Passos

1. **Criar o Flow** seguindo os passos acima
2. **Copiar a URL do webhook**
3. **Fornecer a URL** para que eu configure o código
4. **Testar o envio** com o script que vou criar
5. **Validar os dados** na planilha do SharePoint

Pronto! Vamos começar? 🚀
