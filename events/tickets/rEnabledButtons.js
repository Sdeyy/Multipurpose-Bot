const { Discord, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require("discord.js");
const client = require('../../index')
const ticketSchema = require("../../Models/ticketDB");
const getNumber = require("../../functions/numberTicket");
const blacklistdb = require("../../Models/blacklist");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    const guildData = await ticketSchema.findOne({ guildID: interaction.guild.id });
    if (!guildData) return;
  
    let mapCustomID = guildData.tickets.map(x => x.customID);

    if (!mapCustomID.includes(interaction.customId)) return;

    const data = await blacklistdb.findOne({guildID: interaction.guild.id, userID: interaction.member.user.id})
    if(data) return interaction.reply({content: "You are blacklisted from the tickets", ephemeral: true})

    if (client.config.TICKET.TICKET_LIMIT) {
      const canales = interaction.guild.channels.cache;
      const canales2 = canales.map(c => {
        if (c.type == 'GUILD_VOICE') return;
        if (c.topic == interaction.user.id) {
          return interaction.reply({
            content: `${client.messages.TICKET.ALREADY_OPEN}`,
            ephemeral: true
          });
        }
      });
    }

    const modal = new Modal()
      .setTitle('Ticket Reason')
      .setCustomId(interaction.customId);

    const cualrazon = new TextInputComponent()
      .setCustomId('ticketreason')
      .setLabel(client.messages.TICKET_REASON.LABEL)
      .setPlaceholder(client.messages.TICKET_REASON.PLACEHOLDER)
      .setStyle('SHORT')
      .setRequired(true);

    const row1 = new MessageActionRow()
      .addComponents(cualrazon);

    modal.addComponents(row1);

    await interaction.showModal(modal);
  }
});

client.on("interactionCreate", async (interaction) => {

  const data = await blacklistdb.findOne({guildID: interaction.guild.id, userID: interaction.member.user.id})

  if(interaction.isModalSubmit()) {

    const guildData = await ticketSchema.findOne({ guildID: interaction.guild.id });
    let mapCustomID = guildData.tickets.map(x => x.customID);
    
    if(!mapCustomID.includes(interaction.customId)) return;

    const data = await blacklistdb.findOne({guildID: interaction.guild.id, userID: interaction.member.user.id})
    if(data) return interaction.reply({content: "You are blacklisted from the tickets", ephemeral: true})

    const ticketreason = interaction.fields.getTextInputValue("ticketreason")
    const ticketaccess = client.config.TICKET.TICKET_ACCESS_ROLE;
    const supportrole = client.config.TICKET.SUPPORT_ROLE;

    if (client.config.TICKET.ONE_BUTTON_TICKETS) {

      if (client.config.TICKET.TICKET_LIMIT) {
        const canales = interaction.guild.channels.cache;
        const canales2 = canales.map(c => {
          if (c.type == 'GUILD_VOICE') return;
          if (c.topic == interaction.user.id) {
            return interaction.reply({
              content: `${client.messages.TICKET.ALREADY_OPEN}`,
              ephemeral: true
            });
          }
        });
      }

      const Data = guildData.tickets.find(x => x.customID === interaction.customId);
      let memberID = interaction.member.user.id;
      const ticketRoles = Data.ticketRoles.map(x => {
        return { id: x, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"] };
      });
      const tagRoles = ticketRoles.map(x => {
        return `<@&${x.id}>`;
      });

      await interaction.reply({ embeds: [new MessageEmbed().setColor("ORANGE").setDescription(client.messages.TICKET.ONE_BUTTON_TICKET_CREATING)], ephemeral: true });
      let numberTicket = await getNumber(guildData.ticketCounter, ticketSchema, interaction.guild.id);
      await interaction.channel.setName(`ticket-${numberTicket}`);

      const row = new MessageActionRow().addComponents(
        new MessageButton().setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Style).setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Label).setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Emoji).setCustomId("Ticket-Open-Close"),
        new MessageButton().setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Style).setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Label).setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Emoji).setCustomId("Ticket-Claimed")
      );

      const welcome = new MessageEmbed()
        .setTitle(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Title.replace('<botName>', client.user.username))
        .setDescription(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Description.replace('<ticketReason>', ticketreason).replace('<creationDate>', `<t:${Math.round(interaction.channel.createdTimestamp / 1000)}:R>`))
        .setFooter(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Footer.replace('<botName>', client.user.username))
        .setTimestamp(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Timestamp)
        .setColor(client.config.EMBEDCOLOR);

      interaction.channel.setParent(Data.ticketCategory);
      interaction.channel.permissionOverwrites.set([{ id: interaction.guild.id, deny: ["VIEW_CHANNEL"] }, { id: memberID, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"] }, ...ticketRoles]);

      interaction.message.edit({ content: `<@!${memberID}> | ${tagRoles}`, embeds: [welcome], components: [row] });

      let channelLOG = client.config.TICKET.LOGS_CHANNEL;
      if (!channelLOG) return;
      const log = new MessageEmbed()
        .setTitle(`${client.config.BOTNAME} | Ticket Created`)
        .setColor("GREEN")
        .setDescription(`**User**: <@!${memberID}>\n**Action**: Created a ticket\n**Panel**: ${Data.ticketName}\n**Ticket Name**: ${interaction.channel.name}`);

      interaction.client.channels.cache.get(channelLOG).send({ embeds: [log] });

      return;
    }

    const Data = guildData.tickets.find(x => x.customID === interaction.customId);
    let memberID = interaction.member.user.id;
    const ticketRoles = Data.ticketRoles.map(x => {
      return { id: x, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES", "MANAGE_CHANNELS"] };
    });
    const tagRoles = ticketRoles.map(x => {
      return `<@&${x.id}>`;
    });

    await interaction.reply({ embeds: [new MessageEmbed().setColor("ORANGE").setDescription(client.messages.TICKET.TICKET_CREATING)], ephemeral: true });
    let numberTicket = await getNumber(guildData.ticketCounter, ticketSchema, interaction.guild.id);

    interaction.guild.channels.create(`ticket-${numberTicket}`, {
      type: "text",
      topic: `${memberID}`,
      parent: Data.ticketCategory,
      permissionOverwrites: [{ id: interaction.guild.id, deny: ["VIEW_CHANNEL"] }, { id: memberID, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"] }, ...ticketRoles]
    }).then(async channel => {
      const row = new MessageActionRow().addComponents(
        new MessageButton().setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Style).setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Label).setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Emoji).setCustomId("Ticket-Open-Close"),
        new MessageButton().setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Style).setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Label).setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Emoji).setCustomId("Ticket-Claimed")
      );
      const welcome = new MessageEmbed()
        .setTitle(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Title)
        .setDescription(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Description.replace('<ticketReason>', ticketreason).replace('<creationDate>', `<t:${Math.round(channel.createdTimestamp / 1000)}:R>`))
        .setFooter(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Footer.replace('<botName>', client.user.username))
        .setTimestamp(client.embeds.Embeds.TICKET_OPEN_REASON_ENABLED.Timestamp)
        .setThumbnail(interaction.guild.iconURL())
        .setColor(client.config.EMBEDCOLOR);

      const db = require('../../Models/statisticsModel');
      await db.findOneAndUpdate({ guildID: interaction.guild.id }, {
        $inc: {
          ticketsOpen: 1
        },
      });

      channel.send({ content: `<@!${memberID}> | ${tagRoles}`, embeds: [welcome], components: [row] });

      interaction.editReply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(client.messages.TICKET.TICKET_CREATED.replace('<channel>', `<#${channel.id}>`))], ephemeral: true });

      let channelLOG = client.config.TICKET.LOGS_CHANNEL;
      if (!channelLOG) return;
      const log = new MessageEmbed()
        .setTitle(`${client.config.BOTNAME} | Ticket Created`)
        .setColor("GREEN")
        .setDescription(`**User**: <@!${memberID}>\n**Action**: Created a ticket\n**Panel**: ${Data.ticketName}\n**Ticket Name**: ${channel.name}`);

      interaction.client.channels.cache.get(channelLOG).send({ embeds: [log] });
    });
  }
});
