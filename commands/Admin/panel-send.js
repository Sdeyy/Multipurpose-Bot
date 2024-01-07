const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js")
const { Discord } = require('discord.js')
const ticketDB = require('../../Models/ticketDB');

module.exports = {
    name: "panel-send",
    description: "Send panels.",
    options: [
        {
            name: "ticket-panel",
            description: "Setup ticket panel.",
            type: "SUB_COMMAND",
    
            options: [
                {
                  name: 'type',
                description: 'Type of the panel',
                type: 'STRING',
                required: true,
            choices: [
                {
                    name: 'buttons',
                    value: 'buttons'
                },
                {
                    name: 'dropdown',
                    value: 'dropdown'
                },
                 ],
                },
                {
                    name: "channel",
                    description: "Channel to send ticket-panel.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                    
                },

            ]
        },
        {
            name: "verify",
            description: "Send verify panel.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'channel',
                    description: 'Channel to send verify-panel',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                    required: false
                },
            ],
        },
        {
            name: "bug-report",
            description: "Send Bug Report panel.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: 'channel',
                    description: 'Channel to send bug-report-panel',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                    required: false
                },
            ],
        },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("panel-send")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})

        const { options } = interaction;
        const Sub = options.getSubcommand(["tickets", "verify", "bug-report"]);

        if (Sub === 'ticket-panel') {
    
            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
            }
    

            const type = interaction.options.getString('type');
            const channel = interaction.options.getChannel('channel') || interaction.channel;    

            
            if(type == 'buttons') {

                if(client.config.TICKET.ONE_BUTTON_TICKETS) {

                    const oneticket = new MessageEmbed()
                    .setColor(client.config.EMBEDCOLOR)
                    .setTitle(`${client.embeds.Embeds.ONE_BUTTON_TICKETS.Title}`.replace('<botName>', client.user.username))
                    .setDescription(`${client.embeds.Embeds.ONE_BUTTON_TICKETS.Description}`.replace('<botName>', client.user.username))
                    .setImage(client.embeds.Embeds.ONE_BUTTON_TICKETS.Banner)
                    .setFooter({text: `${client.embeds.Embeds.ONE_BUTTON_TICKETS.Footer}`.replace('<botName>', client.user.username)})
                    .setTimestamp(client.embeds.Embeds.ONE_BUTTON_TICKETS.Timestamp)


                    const row = new MessageActionRow()
                    .addComponents(
                      [
                        new MessageButton()
                        .setCustomId("onebuttonTicket")
                        .setEmoji(client.buttons.ONE_BUTTON_TICKETS.Emoji)
                        .setLabel(client.buttons.ONE_BUTTON_TICKETS.Label)
                        .setStyle(client.buttons.ONE_BUTTON_TICKETS.Style)
                      ],
              
                    )
              

                    await client.channels.cache.get(channel.id).send({embeds: [oneticket], components: [row] }) 
                    interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
                    return;
                }

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
                        style: x.ticketStyle,
                    }
                })
                for(let i = 0; i < options.length; i++) {
                    if(options[i].emoji != undefined) {
                        const button = new MessageButton()
                            .setCustomId(options[i].customID)
                            .setEmoji(options[i].emoji)
                            .setLabel(options[i].name)
                            .setStyle(options[i].style)
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
                .setTitle(`${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Title}`.replace('<botName>', client.user.username))
                .setDescription(`${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Description}`.replace('<ticketPanel>', `${options.map(x => `**${x.name}**\n${x.description}\n ${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.messagePanel} ${x.emoji}`).join('\n\n')}`))
                .setImage(client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Banner)
                .setFooter({text: `${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Footer}`.replace('<botName>', client.user.username)})
                .setTimestamp(client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Timestamp)

                await client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: components}) 
                interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
            } else if(type == 'dropdown') {
                const ticketData = await ticketDB.findOne({
                    guildID: interaction.guild.id
                })
                if(!ticketData) return interaction.reply({content: `No ticket panel found in this server.`, ephemeral: true})
                if(!ticketData.tickets || ticketData.tickets.length === 0) return interaction.reply({content: `No ticket panel created with that name was found.`, ephemeral: true})

    
                    const options = ticketData.tickets.map(x => {
                        return {
                            label: x.ticketName,
                            value: x.customID,
                            description: x.ticketDescription,
                            emoji: x.ticketEmoji,
                            name: x.ticketName,
                        }
                    })
                    
                    const row = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId("ticketDropdown")
                            .setMaxValues(1)
                            .addOptions(options)
                    )
                    const panelEmbed = new MessageEmbed()
                    .setColor(client.config.EMBEDCOLOR)
                    .setTitle(`${client.embeds.Embeds.DROPDOWN_TICKET_PANEL.Title}`.replace('<botName>', client.user.username))
                    .setDescription(`${client.embeds.Embeds.DROPDOWN_TICKET_PANEL.Description}`.replace('<ticketPanel>', `${options.map(x => `**${x.name}**\n${x.description}\n ${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.messagePanel} ${x.emoji}`).join('\n\n')}`))
                    .setImage(client.embeds.Embeds.DROPDOWN_TICKET_PANEL.Banner)
                    .setFooter({text: `${client.embeds.Embeds.DROPDOWN_TICKET_PANEL.Footer}`.replace('<botName>', client.user.username)})
                    .setTimestamp(client.embeds.Embeds.DROPDOWN_TICKET_PANEL.Timestamp)

                    await client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: [row]})     
                    interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
                
            }
             
        } else if (Sub === 'verify') {   

            const c = interaction.options.getChannel('channel') || interaction.channel;

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
            }
        
            const embed = new MessageEmbed()
            .setColor(`${client.config.EMBEDCOLOR}`)
            .setTitle(client.config.VERIFY_SYSTEM.EMBED_CONFIG.TITLE)
            .setDescription(client.config.VERIFY_SYSTEM.EMBED_CONFIG.DESCRIPTION)
            .setFooter(client.config.VERIFY_SYSTEM.EMBED_CONFIG.FOOTER)
            .setImage(client.config.VERIFY_SYSTEM.EMBED_CONFIG.BANNER)
        
        
              const row = new MessageActionRow()
              .addComponents(
                [
                  new MessageButton()
                  .setCustomId('verify')
                  .setStyle(`${client.config.VERIFY_SYSTEM.BUTTON.STYLE}`)
                  .setEmoji(`${client.config.VERIFY_SYSTEM.BUTTON.EMOJI}`)
                  .setLabel(`${client.config.VERIFY_SYSTEM.BUTTON.LABEL}`)
                ],
        
              )
        
              const enviado = new MessageEmbed()
              .setColor('GREEN')
              .setDescription(`${client.messages.VERIFY.PANEL_SENT}`.replace('<channel>', `${c}`))
        
              interaction.reply({ embeds: [enviado], ephemeral: true})
        
              c.send({
                  embeds: [embed],
                  components: [row]
              })
           

        } else if (Sub === 'bug-report') {   

            if(!client.config.BUG_REPORT.ENABLED) return interaction.reply({ content: "The Bug Report System is disabled, please enable it on config.", ephemeral: true });
            const c = interaction.options.getChannel('channel') || interaction.channel;

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
            }
            const embed = new MessageEmbed()
            .setColor(`${client.config.EMBEDCOLOR}`)
            .setTitle(client.config.BUG_REPORT.EMBED.TITLE)
            .setDescription(client.config.BUG_REPORT.EMBED.DESCRIPTION)
            .setFooter(client.config.BUG_REPORT.EMBED.FOOTER)
        
        
              const row = new MessageActionRow()
              .addComponents(
                [
                  new MessageButton()
                  .setCustomId('bugreportbtn')
                  .setStyle(`${client.config.BUG_REPORT.BUTTON.STYLE}`)
                  .setEmoji(`${client.config.BUG_REPORT.BUTTON.EMOJI}`)
                  .setLabel(`${client.config.BUG_REPORT.BUTTON.LABEL}`)
                ],)
              const enviado = new MessageEmbed()
              .setColor('GREEN')
              .setDescription(`${client.messages.BUG_REPORT.PANEL_SENT}`.replace('<channel>', `${c}`))
        
              interaction.reply({ embeds: [enviado], ephemeral: true})
        
              c.send({
                  embeds: [embed],
                  components: [row]
              })
        }
    }
}