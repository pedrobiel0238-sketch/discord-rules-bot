# Discord Rules Panel — Vetra Cloud

Bot simples, profissional e leve para Discord.js v14.

## Requisitos
- Node.js 18+
- Token de bot do Discord
- `CLIENT_ID` do bot
- `GUILD_ID` do servidor
- Opcional: `RULES_CHANNEL_ID`

## Deploy na Vetra Cloud
1. Envie este projeto para a Vetra Cloud.
2. Instale as dependências com `npm install`.
3. Configure as variáveis de ambiente.
4. Inicie com `npm start`.
5. No Discord, use `/painel-regras`.

## Variáveis
`DISCORD_TOKEN` — token secreto do bot.
`CLIENT_ID` — ID da aplicação.
`GUILD_ID` — ID do servidor.
`RULES_CHANNEL_ID` — ID do canal de regras; deixe vazio para permitir o comando em qualquer canal.

## Segurança
Nunca coloque o token diretamente no código ou envie o `.env` para terceiros.
