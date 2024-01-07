const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ticketSchema = require("../../Models/ticketDB");

module.exports = {
    name: "add",
    description: "add a member to a ticket",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to add',
            type: 'USER',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("add")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!guildData) return interaction.reply({content: 'NO data found.', ephemeral: true})
        
        const rolesupport = client.config.TICKET.SUPPORT_ROLE;
        if(!interaction.member.roles.cache.get(rolesupport)) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: 'You can only use this command on a ticket!', ephemeral: true})
        const ticketData = guildData.tickets.map(z  => { return { customBID: z.customBID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
        const categoryID = ticketData.map(x => {return x.ticketCategory})
        if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: 'You can only use this command on a ticket!', ephemeral: true})
        
        let user = interaction.options.getUser('user');
        let añadido = user.id;

        if(!user) return interaction.reply({embeds: [embed2]})
        interaction.channel.permissionOverwrites.edit(añadido, {
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        })
        const embed = new MessageEmbed()
        .setTitle(`${client.config.BOTNAME} | User Added`)
        .setDescription(`Staff:\n <@!${interaction.member.user.id}>\n Member Added:\n<@!${(await client.users.fetch(añadido)).id}>`)
        .setColor(`${client.config.EMBEDCOLOR}`)
        .setTimestamp()
        interaction.reply({
            embeds: [embed]
        })

        let channelLOG = client.config.TICKET.LOGS_CHANNEL;
        if(!guildData) return interaction.reply({content: `No panels found.`, ephemeral: true})
        let logcanal = guildData.channelLog;
        if(!logcanal) return;
        if(client.config.TICKET.LOGS_SYSTEM) {
          client.channels.cache.get(channelLOG).send(
            {embeds: [new MessageEmbed()
                .setTitle(`${client.config.BOTNAME} | Member Added`)
                .setColor("GREEN")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Add a member
                **Member Add**: <@!${user.id}>
                **Ticket Name**: ${interaction.channel.name}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)]}
        )
        }
        if(!client.config.TICKET.LOGS_SYSTEM) {
        return;
        }
    },
};