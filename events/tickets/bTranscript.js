const { MessageButton, MessageEmbed, MessageActionRow} = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const client = require("../../index");
const ticketSchema = require("../../Models/ticketDB");
let supportRole = client.config.TICKET.SUPPORT_ROLE;

client.on("interactionCreate", async (interaction) => {
	
	if (interaction.isButton()) {
		
		if (interaction.customId == "Ticket-Transcript") {
			let idmiembro = interaction.channel.topic;

			if(!interaction.member.roles.cache.has(supportRole)) {
                return;
            }

			const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
			if (!guildData) return interaction.reply({content: `NO data found.`,ephemeral: true})
			
			interaction.deferUpdate();
			const trow = new MessageActionRow().addComponents(new MessageButton().setCustomId("TR-YES").setLabel("Yes").setStyle("SUCCESS"),new MessageButton().setCustomId("TR-CN").setLabel("Cancel").setStyle("SECONDARY"),new MessageButton().setCustomId("TR-NO").setLabel("No").setStyle("DANGER"))
			interaction.channel.send({embeds: [new MessageEmbed().setDescription('Do you want to send the ticket to the user?').setColor(`${client.config.EMBEDCOLOR}`)],components: [trow]})
		}
	}
	if (interaction.isButton()) {


		let idmiembro = interaction.channel.topic;

			let logcanal = client.config.TICKET.LOGS_CHANNEL;
            let transcriptcanal = client.config.TICKET.TRANSCRIPT_CHANNEL;
			
		if (interaction.customId == "TR-CN") {
			
			interaction.deferUpdate();
			interaction.message.delete();
		}
		if (interaction.customId == "TR-YES") {
			interaction.deferUpdate();

			interaction.message.delete();
			const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("YELLOW")
			let savingMessage = interaction.channel.send({embeds: [saving]})

			const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});

			const mensaje = new MessageEmbed().setAuthor(interaction.client.users.cache.get(idmiembro).tag, interaction.client.users.cache.get(idmiembro).avatarURL({dynamic: true})).addField("Ticket Owner", `<@!${idmiembro}>`, true).addField("Ticket Name", `${interaction.channel.name}`, true).setColor(`${client.config.EMBEDCOLOR}`)
			const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
			await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje],files: [file]}).then((a) => {
				const Data = guildData.tickets.find((x) => x.ticketCategory === interaction.channel.parentId);

				a.edit({embeds: [mensaje.addField( "Panel Name",  `${Data.ticketName}`, true).addField( "Direct Transcript", `[Direct Transcript](${a.attachments.first().url})`,  true).addField("Ticket Closed", `${interaction.member.user}`, true)]})
			})

			const trsend = new MessageEmbed().setDescription(`Transcript Saved To <#${transcriptcanal}>`).setColor("GREEN")
			;(await savingMessage).edit({embeds: [trsend]})

			let user = interaction.client.users.cache.get(idmiembro);
			try {await user.send({embeds: [mensaje],files: [file]})}
			catch (error) {(await savingMessage).edit({embeds: [new MessageEmbed().setDescription(`This user has closed direct messages`).setColor("RED")]})}

			if (!guildData.channelLog) return;
			const log = new MessageEmbed().setTitle(`${client.config.BOTNAME} | Transcript Saved`).setColor("GREEN").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`)
			interaction.client.channels.cache.get(logcanal).send({embeds: [log]});
		}
		if (interaction.customId == "TR-NO") {
			interaction.deferUpdate();
			interaction.message.delete();		
				const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})

			const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("YELLOW")
			let savingMessage = interaction.channel.send({embeds: [saving]})

			const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});

			const mensaje = new MessageEmbed().setAuthor(interaction.client.users.cache.get(idmiembro).tag, interaction.client.users.cache.get(idmiembro).avatarURL({dynamic: true})).addField("Ticket Owner", `<@!${idmiembro}>`, true).addField("Ticket Name", `${interaction.channel.name}`, true).setColor(`${client.config.EMBEDCOLOR}`)
			await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje],files: [file]}).then((a) => {
				const Data = guildData.tickets.find((x) => x.ticketCategory === interaction.channel.parentId);

				a.edit({embeds: [mensaje.addField("Panel Name", `${Data.ticketName}`,  true).addField( "Direct Transcript", `[Direct Transcript](${a.attachments.first().url})`, true).addField("Ticket Closed", `${interaction.member.user}`, true)]})
			})

			const trsend = new MessageEmbed().setDescription(`Transcript saved to <#${transcriptcanal}>`).setColor("GREEN")
			;(await savingMessage).edit({embeds: [trsend]})


			const log = new MessageEmbed().setTitle(`${client.config.BOTNAME} | Transcript Saved`).setColor("GREEN").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`)
			interaction.client.channels.cache.get(logcanal).send({embeds: [log]});

		};
	}
});