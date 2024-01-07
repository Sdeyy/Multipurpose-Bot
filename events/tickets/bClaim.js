const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require('../../index')
const ticketSchema = require("../../Models/ticketDB");

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId == "Ticket-Claimed") {
            interaction.deferUpdate();

            const adminRole = client.config.TICKET.ADMIN_ROLE;
            let supportRole = client.config.TICKET.SUPPORT_ROLE;
            if(!interaction.member.roles.cache.has(supportRole)) {
                return;
            }

            const db = require('../../Models/statisticsModel');
            await db.findOneAndUpdate({guildID: interaction.guild.id}, {
                $inc: {
                    ticketsClaimed: 1
                },
            })
            let idmiembro = interaction.channel.topic;
            interaction.channel.permissionOverwrites.edit(client.config.GUILDID, {
                'VIEW_CHANNEL': false
                }).catch(error => 
                console.log(error))
    
                interaction.channel.permissionOverwrites.edit(idmiembro, {
                'VIEW_CHANNEL': true,
                "SEND_MESSAGES": true,
                "ADD_REACTIONS": true,
                "ATTACH_FILES": true,
                "EMBED_LINKS": true
                }).catch(error => 
                console.log(error))
    
                interaction.channel.permissionOverwrites.edit(interaction.member.id, {
                'VIEW_CHANNEL': true,
                "SEND_MESSAGES": true,
                "ADD_REACTIONS": true,
                "ATTACH_FILES": true,
                "EMBED_LINKS": true,
                "MANAGE_MESSAGES": true,
                "MANAGE_CHANNELS": true
                }).catch(error => 
                console.log(error))
    
                interaction.channel.permissionOverwrites.edit(supportRole, {
                'VIEW_CHANNEL': false
                }).catch(error => 
                console.log(error))
                
                interaction.channel.permissionOverwrites.edit(adminRole, {
                'VIEW_CHANNEL': true,
                "SEND_MESSAGES": true,
                "ADD_REACTIONS": true,
                "ATTACH_FILES": true,
                "EMBED_LINKS": true,
                "MANAGE_MESSAGES": true,
                "MANAGE_CHANNELS": true
                }).catch(error => 
                console.log(error))
            const row = new MessageActionRow().addComponents(
                new MessageButton().setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Style).setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Label).setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Close.Emoji).setCustomId("Ticket-Open-Close"),
                new MessageButton().setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Style).setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Label).setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Claim.Emoji).setCustomId("Ticket-Claimed").setDisabled(true))
            interaction.message.edit({
                components: [row]
            })
            const embed = new MessageEmbed()
                .setDescription(`${client.messages.TICKET.TICKET_CLAIMED}`.replace("<user>", `${interaction.member.user.tag}`))
                .setColor(`${client.config.EMBEDCOLOR}`);

            interaction.message.channel.send({embeds: [embed]})


            let channelLOG = client.config.TICKET.LOGS_CHANNEL;

            if(client.config.TICKET.LOGS_SYSTEM) {
                interaction.client.channels.cache.get(channelLOG).send(
                    {embeds: [new MessageEmbed()
                        .setTitle(""+`${client.config.BOTNAME
                        }`+" | Ticket Claimed")
                        .setColor("YELLOW")
                        .setDescription(`
                        **User**: <@!${interaction.member.user.id}>
                        **Action**: Claimed a ticket
                        **Ticket Name**: ${interaction.channel.name}
                        **Ticket Owner**: <@!${interaction.channel.topic}>`)]}
                    
                )
                    }

        
    }
    }
})