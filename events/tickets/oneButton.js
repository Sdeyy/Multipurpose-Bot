const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require('../../index')
const ticketDB = require('../../Models/ticketDB');
const getNumber = require("../../functions/numberTicket");
const blacklistdb = require("../../Models/blacklist");

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        if(interaction.customId == "onebuttonTicket"){
            
            const disabled = new MessageEmbed()
            .setColor(client.config.EMBEDCOLOR)
            .setDescription(client.messages.TICKET.ONE_BUTTON_TICKET_DISABLED)
            if(!client.config.TICKET.ONE_BUTTON_TICKETS) return interaction.reply({ embeds: [disabled], ephemeral: true})

            const memberID = interaction.user.id;
            const cCategory = client.config.TICKET.ONE_BUTTON_CATEGORY;
            const ticketaccess = client.config.TICKET.TICKET_ACCESS_ROLE

            if(client.config.TICKET.TICKET_LIMIT) {
                const canales = interaction.guild.channels.cache;
                const canales2 = canales.map(c => {
                    if(c.type == 'GUILD_VOICE') return; 
                    if(c.topic == interaction.user.id){ ; return interaction.reply({
                        content: `${client.messages.TICKET.ALREADY_OPEN}`,
                        ephemeral: true
                    }) }
                })
               }

            const data = await blacklistdb.findOne({guildID: interaction.guild.id, userID: interaction.member.user.id})
            if(data) return interaction.reply({content: "You are blacklisted from the tickets", ephemeral: true})

            await interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setDescription(client.messages.TICKET.TICKET_CREATING)], ephemeral: true})
        
            interaction.guild.channels.create(`waiting-${interaction.user.username}`, {
                type: "text",
                topic: `${memberID}`,
                parent: cCategory,
                permissionOverwrites : [{id: interaction.guild.id,deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]},{id: memberID,allow: ["VIEW_CHANNEL", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]},{id: ticketaccess, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]}]
            }).then(async channel => {

            
                const ticketData= await ticketDB.findOne({
                    guildID: interaction.guild.id
                })
                    if(!ticketData) return interaction.reply({content: `No ticket panel created with that name was found.`, ephemeral: true})
                    if(!ticketData.tickets || ticketData.tickets.length === 0) return interaction.reply({content: `No ticket panel found in this server.`, ephemeral: true})
                    const components = [];
                    lastComponents = new MessageActionRow();
                    const options = ticketData.tickets.map(x => {
                        return {
                            customID:  x.customID,
                            emoji:  x.ticketEmoji,
                            name: x.ticketName,
                            description: x.ticketDescription,
                        }
                    })
                    for(let i = 0; i < options.length; i++) {
                        if(options[i].emoji != undefined) {
                            const button = new MessageButton()
                                .setCustomId(options[i].customID)
                                .setEmoji(options[i].emoji)
                                .setLabel(options[i].name)
                                .setStyle(client.buttons.MULTI_BUTTONS_TICKETS.Style)
                            lastComponents.addComponents(button)
                            if(lastComponents.components.length === 5) {
                                components.push(lastComponents)
                                lastComponents = new MessageActionRow();
                            }
                        }
                    }
                    if(lastComponents.components.length > 0) {components.push(lastComponents)}
                    const panelEmbed = new MessageEmbed()
                    .setColor(client.config.EMBEDCOLOR)
                    .setTitle(`${client.embeds.Embeds.ONE_BUTTON_TICKET_OPEN.Title}`.replace('<botName>', client.user.username))
                    .setDescription(`${client.embeds.Embeds.ONE_BUTTON_TICKET_OPEN.Description}`)
                    .setImage(client.embeds.Embeds.ONE_BUTTON_TICKET_OPEN.Banner)
                    .setFooter({text: `${client.embeds.Embeds.ONE_BUTTON_TICKET_OPEN.Footer}`.replace('<botName>', client.user.username)})
                    .setTimestamp(client.embeds.Embeds.ONE_BUTTON_TICKET_OPEN.Timestamp)
    
                    await channel.send({embeds: [panelEmbed], components: components}) 
                    await interaction.editReply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${client.messages.TICKET.TICKET_CREATED}`.replace('<channel>', `<#${channel.id}>`))], ephemeral: true})


                })
        }

    }
})