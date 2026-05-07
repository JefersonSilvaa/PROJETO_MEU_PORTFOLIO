# Documentação: Sistema de Agenda Dinâmica com Períodos de Vigência

## Estrutura de `service-schedule.json`

O arquivo `assets/data/service-schedule.json` define a agenda de cultos e eventos da PIBESC com suporte a períodos especiais (férias, campanhas, eventos temáticos).

### Seção `days` (Agenda Padrão)

Define a agenda regular que é usada quando nenhum período especial está ativo:

```json
"days": {
  "0": [...],  // Domingo (0)
  "2": [...],  // Terça (2)
  "3": [...],  // Quarta (3)
  "4": [...],  // Quinta (4)
  "5": [...],  // Sexta (5)
  "6": [...],  // Sábado (6)
}
```

**Nota**: Use índices de 0-6 para os dias da semana (domingo=0, segunda=1, ... sábado=6).

Cada dia contém um array de eventos com estrutura:
```json
{
  "time": "HH:MM",           // Horário no formato 24h
  "name": "Nome do Evento",  // Nome do culto/evento
  "message": "Descrição..."  // Mensagem exibida no widget
}
```

### Seção `periods` (Períodos Especiais)

Define períodos em que a agenda é alterada (férias, campanhas, eventos especiais):

```json
"periods": {
  "vacation-jan-2026": {
    "label": "Férias de Janeiro",
    "startDate": "2026-01-15",      // Data de início (YYYY-MM-DD)
    "endDate": "2026-01-31",        // Data de término (YYYY-MM-DD)
    "schedule": {                    // Mesma estrutura de "days"
      "0": [...],
      "2": [...],
      // ... outros dias ...
    }
  }
}
```

## Como Adicionar um Novo Período

### Passo 1: Escolha um ID único
Use um ID descritivo em snake_case, ex: `campaign-pascoa-2026`, `vacation-summer-2026`, `event-ceia-2026`

### Passo 2: Defina as datas de vigência
Use formato ISO `YYYY-MM-DD`:
- `"startDate": "2026-06-01"`
- `"endDate": "2026-06-30"`

### Passo 3: Configure o schedule
Copie a estrutura de `days` e customize conforme necessário. Você pode:
- Manter dias com eventos normais
- Adicionar eventos novos
- Deixar dias vazios (array vazio `[]`)
- Remover certos dias da semana

### Exemplo: Período de Campanha

```json
"periods": {
  "campaign-harvest-2026": {
    "label": "Semana de Colheita - Agosto",
    "startDate": "2026-08-01",
    "endDate": "2026-08-10",
    "schedule": {
      "0": [
        { "time": "08:00", "name": "EBD Colheita", "message": "Tema: Colhendo frutos do Espírito." },
        { "time": "09:15", "name": "Culto Principal", "message": "Culto especial da campanha." },
        { "time": "19:00", "name": "Culto Noturno", "message": "Culto complementar à noite." }
      ],
      "2": [
        { "time": "19:00", "name": "Culto da Campanha", "message": "Dia especial de oração." }
      ],
      "3": [
        { "time": "19:00", "name": "Culto da Campanha", "message": "Dia especial de oração." }
      ],
      "4": [
        { "time": "19:00", "name": "Culto da Campanha", "message": "Dia especial de oração." }
      ],
      "5": [
        { "time": "19:00", "name": "Culto da Campanha", "message": "Dia especial de oração." }
      ],
      "6": [
        { "time": "19:30", "name": "Encerramento", "message": "Encerramento glorioso da campanha." }
      ]
    }
  }
}
```

## Lógica de Seleção de Período

O sistema `next-service.js` funciona desta forma:

1. **Verifica período ativo**: Compara a data atual com os `startDate` e `endDate` de cada período
2. **Se ativo**: Usa o `schedule` do período
3. **Se inativo**: Usa o `schedule` padrão de `days`
4. **Atualiza a cada minuto**: Widget recalcula o próximo evento automaticamente

## Períodos Inclusos

### 1. Férias de Janeiro (15-31 jan 2026)
- Reduzida a 2-3 eventos por dia
- Sem reuniões de ministérios
- Dinâmica festiva familiar

### 2. Semana de Campanha (1-8 fev 2026)
- Cultos todos os dias
- Tema especial "Crescimento Espiritual"
- Tematização de todas as reuniões

### 3. Temporada de Páscoa (1-30 abr 2026)
- Manutenção integral com tematização
- Tema: "Ressurreição de Cristo"
- Todos os dias da semana com eventos

## Notas Importantes

- **Sem sobreposições**: Se dois períodos se sobrepõem, o primeiro definido tem prioridade
- **Datas inclusivas**: Uma data que aparece em `startDate` até `endDate` é considerada dentro do período
- **Formato ISO**: Sempre use `YYYY-MM-DD` para as datas
- **Compatibilidade**: Períodos vazios ou incompletos funcionam sem erros (dias sem eventos exibem próximo dia)
- **Reload**: Alterações no JSON são carregadas automaticamente (sem cache)

## Variáveis Disponíveis no Widget

O widget agora inclui:
- `nextService.periodLabel`: Label do período ativo (ex: "Férias de Janeiro") ou `null` se período padrão
- Pode ser usado para exibir mensagens especiais ou contexto visual

---

**Última atualização**: 5 de maio de 2026
