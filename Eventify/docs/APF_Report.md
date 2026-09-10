# Artefatos do Trabalho em Equipe – APF
## Projeto: Eventify (Gestão de Eventos e Participantes)

### 1. Levantamento de Requisitos
**RF1** - Manter Eventos (CRUD)
**RF2** - Manter Participantes (CRUD)
**RF3** - Inscrever Participante em Evento (1:N)

### 2. Contagem APF (IFPUG)
**Fronteiras:** Interna (Módulo Eventify), Externa (ViaCEP, Receita Federal).

#### Funções de Dados
- **ALI Evento:** Simples (7 PF)
- **ALI Participante:** Simples (7 PF)
- **AIE CEP_LOCAL:** Simples (5 PF)
- **AIE CPF_RECEITA:** Simples (5 PF)

#### Funções de Transação
- **EE (Entradas Externas):** 16 transações médias (64 PF)
- **CE (Consultas Externas):** 14 transações médias (56 PF)
- **SE (Saídas Externas):** 0 transações

#### Resultados
- **Tamanho Bruto (PFB):** 144 PFB
- **Fator de Ajuste (VFA):** 0.72 (Usabilidade 3, Desempenho 2, Processamento 2)
- **Tamanho Ajustado (PFA):** 103.68 PFA
- **Esforço Estimado:** 207.36 horas (2h / PF)
- **Orçamento Estimado:** R$ 10.368,00 (R$ 50,00 / hora)
