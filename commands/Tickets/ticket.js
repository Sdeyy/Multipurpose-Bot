const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const ticketDB = require('../../Models/ticketDB');

module.exports = {
    name: "ticket",
    description: "Setup ticket panel.",
    options: [
        {
            name: "setup-panel",
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
            name: "setup-channels",
            description: "Setup ticket channels (Logs & Transcripts).",
            type: "SUB_COMMAND",
        },
        {
            name: "create-category",
            description: "Create category.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "category-name",
                    description: "Name of the category",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-id",
                    description: "ID of the category",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-description",
                    description: "Category Description (Ticket Panel Description)",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-button-emoji",
                    description: "Category Button Emoji.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "category-button-style",
                    description: "DANGER | SUCCESS | PRIMARY | SECONDARY",
                    type: "STRING",
                    required: true

                },
                {
                    name: "category-category",
                    description: "Category to open tickets.",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_CATEGORY"],
                    required: true
                },
                {
                    name: "category-support-role-1",
                    description: "Support role 1.",
                    type: "ROLE",
                    required: true
                },
                {
                    name: "category-support-role-2",
                    description: "Support role 2. (OPTIONAL)",
                    type: "ROLE",
                    required: false
                },
                {
                    name: "category-support-role-3",
                    description: "Support role 3. (OPTIONAL)",
                    type: "ROLE",
                    required: false
                },
            ]
        },
        {
            name: "delete-category",
            description: "Delete a specific category.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "category-id",
                    description: "Ticket category ID.",
                    type: "STRING",
                    required: true
                },

            ],
        },
        {
            name: "list-category",
            description: "Panel Category list",
            type: "SUB_COMMAND",

        },
        {
            name: "alert",
            description: "Notify a user that their ticket will be closed.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to notify",
                    type: "USER",
                    required: true
                }
            ]
        }

    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("ticket")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const Sub = interaction.options.getSubcommand(["setup-panel","setup-channels","create-category","delete-category","list-category","alert"]);
        let Name = interaction.options.getString("category-name");
        let role2 = interaction.options.getRole("category-support-role-2");
        let role3 = interaction.options.getRole("category-support-role-3");
        let Description = interaction.options.getString("category-description");
        let Emoji = interaction.options.getString("category-button-emoji");
        let Category = interaction.options.getChannel("category-category");
        let customID = interaction.options.getString("category-id");
        let Style = interaction.options.getString("category-button-style");


  
        if (Sub === 'setup-panel') {

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
                    .setTitle(`${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Title}`.replace('<botName>', client.user.username))
                    .setDescription(`${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Description}`.replace('<ticketPanel>', `${options.map(x => `**${x.name}**\n${x.description}\n ${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.messagePanel} ${x.emoji}`).join('\n\n')}`))
                    .setImage(client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Banner)
                    .setFooter({text: `${client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Footer}`.replace('<botName>', client.user.username)})
                    .setTimestamp(client.embeds.Embeds.MULTI_BUTTONS_TICKETS.Timestamp)

                    await client.channels.cache.get(channel.id).send({embeds: [panelEmbed], components: [row]})     
                    interaction.reply({content: `Panel sent correctly to ${channel}!`, ephemeral: true})
                
            }


        } else if (Sub === 'create-category') {

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
            }
    

            const guildData = await ticketDB.findOne({
                guildID: interaction.guild.id
            })
            let role1 = interaction.options.getRole("category-support-role-1") || client.config.TICKET.SUPPORT_ROLE;
    
            const newTicket = {
                customID: customID,
                ticketName: Name,
                ticketDescription: Description,
                ticketCategory: Category.id,
                ticketEmoji: Emoji,
                ticketStyle: Style,
                ticketRoles: [role1 ? role1.id : null, role2 ? role2.id : role1.id, role3 ? role3.id : role1.id],
            }
            const roles = newTicket.ticketRoles.map(x => interaction.guild.roles.cache.get(x));
            const rolesUnique = roles.filter((v, i, a) => a.indexOf(v) === i);
            newTicket.ticketRoles = rolesUnique.map(x => x.id);
            
            if(guildData) {
                let ticketData = guildData.tickets.find((x) => x.customID === customID);
                if(ticketData) {
                    return interaction.reply({content: `Category <custom_id> already exists`.replace('<custom_id>', customID), ephemeral: true})
                } else {
                    guildData.tickets = [...guildData.tickets, newTicket];
                }
                await guildData.save()
            } else {
                await ticketDB.create({
                    guildID: interaction.guild.id,
                    tickets: [newTicket]
                })
            }
            let embed = new MessageEmbed()
                .setTitle(`${client.config.BOTNAME} | Tickets`)
                .setDescription(`<a:Si:900497814029750274> Category with ID **${customID}** has been created successfully!\n\n**Category Info**\nCategory Name: ${Name}\nDropdown Description: ${Description}\nCategory Roles: ${rolesUnique.map(x =>`<@&${x.id}>`).join(', ')}\nButton Panel Style: ${Style}\nEmoji Panel Button: ${Emoji}`)
                .setColor(`${client.config.EMBEDCOLOR}`)
            return interaction.reply({embeds: [embed]})
        

        } else if (Sub === 'delete-category') {

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
                return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
            }
    


            let categoryid = interaction.options.getString("category-id");

            const guildData = await ticketDB.findOne({guildID: interaction.guild.id})

            if(!guildData) {
                return interaction.reply({content: `No ticket panel found in this server.`, ephemeral: true})
            }
    
            const guildTicket = guildData.tickets
            const findTicket = guildTicket.find(x => x.customID == categoryid)
            if(!findTicket) {
                return interaction.reply({content: `No ticket panel created with that name was found.`, ephemeral: true})
            }
    
            const filteredTickets = guildTicket.filter(x => x.customID != categoryid)
            guildData.tickets = filteredTickets;
    
            await guildData.save()
    
            let embed = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setTitle(`${client.config.BOTNAME} | Tickets`)
                .setDescription(`<a:Si:900497814029750274> The panel has been successfully **removed**`);
            return interaction.reply({embeds: [embed]})

    

        } else if (Sub === 'list-category'){

            if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
        }


            const ticketList = await ticketDB.findOne({
                guildID: interaction.guild.id
            })
            if(!ticketList) {
                let embed = new MessageEmbed()
                    .setColor(client.config.EMBEDCOLOR)
                    .setTitle(`${client.config.BOTNAME} | Tickets`)
                    .setDescription(`No panels created`)
                return interaction.reply({embeds: [embed]})
            }
            if(!ticketList || !ticketList.tickets || ticketList.tickets.length === 0) {
                let embed = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setTitle(`${client.config.BOTNAME} | Tickets`)
                    .setDescription(`No panels created`)
                return interaction.reply({embeds: [embed]})
            }
            const data = [];
    
            const options = ticketList.tickets.map(x => {
                return {
                    customID: x.customID,
                    ticketName: x.ticketName,
                    ticketDescription: x.ticketDescription,
                    ticketCategory: x.ticketCategory,
                    ticketEmoji: x.ticketEmoji,
                    ticketStyle: x.ticketStyle,
                    ticketRoles: x.ticketRoles,
                    }
                })
            for(let i = 0; i < options.length; i++) {

                data.push(`<:text3:919776622956118017> **Category info with ID:** ${options[i].customID} `)
                data.push(`Category Name: ${options[i].ticketName}`)
                data.push(`Dropdown Panel Description: ${options[i].ticketDescription}`)
                data.push(`Category Emoji: ${options[i].ticketEmoji}`)
                data.push(`Category Style: ${options[i].ticketStyle}`)
                data.push(`Category Roles: ${options[i].ticketRoles.map(x => interaction.guild.roles.cache.get(x)).join(", ") || "No specified!"}`)
                data.push(`Category: ${options[i].ticketCategory}\n`)
            }
            
            const embed = new MessageEmbed()
            .setColor(client.config.EMBEDCOLOR)
            .setTitle(`${client.config.BOTNAME} | Ticket - Category List`)
            .setDescription(`${data.join("\n")}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            return interaction.reply({embeds: [embed]})

        }else if (Sub === 'alert'){


            const guildData = await ticketDB.findOne({
                guildID: interaction.guild.id
            })

            const rolesupport = client.config.TICKET.SUPPORT_ROLE;

            if(!interaction.member.roles.cache.get(rolesupport)) {
                return;
            }else if(!interaction.member.permissions.has("ADMINISTRATOR")){
                return;
            } 

            if(!guildData) return interaction.reply({content: 'No data found.', ephemeral: true})
      
            if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: 'This server does not have a ticket panel', ephemeral: true})
            const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
            const categoryID = ticketData.map(x => {return x.ticketCategory})
            if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: 'You can only use this command on a ticket!', ephemeral: true})
    
            let user = interaction.options.getUser('user');
             const embed = new MessageEmbed()
             .setDescription(`${client.messages.TICKET.ALERT_MESSAGE}`.replace('<user>', `${user.username}`))
             .setColor("YELLOW")
                 try {
                await user.send({embeds: [embed]})	
                    } catch (error) {
                 return interaction.reply({
                     embeds: [new MessageEmbed().setDescription(`\n❌ Error: ${error}`).setColor("RED")]
                     })
    }

    interaction.reply({
        embeds: [new MessageEmbed().setDescription(`${client.messages.TICKET.ALERT_SENT}`.replace('<user>', `${user}`)).setColor("GREEN")]
    })
        if(!guildData) return interaction.reply({content: `No data found.`, ephemeral: true})
  
    
}
        }
    }

    
