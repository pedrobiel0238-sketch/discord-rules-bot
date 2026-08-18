require("dotenv").config();
const {
  Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder,
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  PermissionsBitField
} = require("discord.js");

const required = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Variável obrigatória ausente: ${key}`);
    process.exit(1);
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rules = [
  "Respeite todos os membros e a equipe de moderação.",
  "Não envie spam, flood, mensagens repetitivas ou conteúdo malicioso.",
  "Não pratique discriminação, assédio ou ameaças.",
  "Evite divulgação sem autorização da administração.",
  "Use cada canal para sua finalidade.",
  "Siga as decisões da moderação e utilize os canais corretos para recursos.",
  "Não compartilhe dados pessoais seus ou de terceiros.",
  "A equipe pode atualizar estas regras quando necessário."
];

function buildPanel() {
  const description = rules.map((r, i) => `**${i + 1}.** ${r}`).join("\n\n");
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("📜 Central de Regras")
    .setDescription("Leia atentamente as regras abaixo para manter a comunidade organizada, segura e agradável.")
    .addFields(
      { name: "⚖️ Regras da comunidade", value: description },
      { name: "🛡️ Moderação", value: "Infrações podem resultar em advertência, timeout, expulsão ou banimento, conforme a gravidade." },
      { name: "✅ Ao permanecer no servidor", value: "Você concorda em respeitar estas regras e as orientações da equipe." }
    )
    .setFooter({ text: "Painel de Regras • Atualizado pela administração" })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("rules_confirm")
      .setLabel("Li e estou ciente")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("rules_refresh")
      .setLabel("Ver novamente")
      .setEmoji("📖")
      .setStyle(ButtonStyle.Secondary)
  );
  return { embeds: [embed], components: [row] };
}

const commands = [
  new SlashCommandBuilder()
    .setName("painel-regras")
    .setDescription("Envia o painel profissional de regras neste canal.")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .toJSON()
];

client.once("ready", async () => {
  console.log(`Online como ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("Comando /painel-regras registrado.");
  } catch (err) {
    console.error("Falha ao registrar comando:", err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === "painel-regras") {
    if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: "❌ Você precisa de **Gerenciar Servidor**.", ephemeral: true });
    }
    if (process.env.RULES_CHANNEL_ID && interaction.channelId !== process.env.RULES_CHANNEL_ID) {
      return interaction.reply({ content: "❌ Este comando só pode ser usado no canal configurado de regras.", ephemeral: true });
    }
    await interaction.channel.send(buildPanel());
    return interaction.reply({ content: "✅ Painel de regras enviado.", ephemeral: true });
  }

  if (interaction.isButton()) {
    if (interaction.customId === "rules_confirm") {
      return interaction.reply({
        content: "✅ Obrigado! Você confirmou que leu e está ciente das regras do servidor.",
        ephemeral: true
      });
    }
    if (interaction.customId === "rules_refresh") {
      return interaction.reply({ ...buildPanel(), ephemeral: true });
    }
  }
});

client.on("error", console.error);
process.on("unhandledRejection", console.error);

client.login(process.env.DISCORD_TOKEN);
