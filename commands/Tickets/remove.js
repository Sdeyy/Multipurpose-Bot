const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ticketSchema = require("../../Models/ticketDB");
module.exports = {
    name: "remove",
    description: "remove a user of a ticket",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to remove',
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

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("remove")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!guildData) return interaction.reply({content: 'NO data found.', ephemeral: true})


        const rolesupport = client.config.TICKET.SUPPORT_ROLE;
        if(!interaction.member.roles.cache.get(rolesupport)) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})


        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: 'No panel found.', ephemeral: true})
        const ticketData = guildData.tickets.map(z  => { return { customBID: z.customBID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
        const categoryID = ticketData.map(x => {return x.ticketCategory})
        if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: 'You can only use this command on a ticket.', ephemeral: true})

        let si = interaction.options.getUser('user');
        let removido = si.id;

        interaction.channel.permissionOverwrites.edit(removido, {
          VIEW_CHANNEL: false
        })


        const embed = new MessageEmbed()
        .setTitle(`${client.config.BOTNAME} | User Removed`)
        .setDescription(`Staff:\n <@!${interaction.user.id}>\nMember Removed:\n<@!${(await client.users.fetch(removido)).id}>`)
        .setColor("RED")
        .setTimestamp()
        interaction.reply({
            embeds: [embed]
        })

        let logcanal = client.config.TICKET.LOGS_CHANNEL;;
        if(client.config.TICKET.LOGS_SYSTEM) {
          client.channels.cache.get(logcanal).send({
            embeds: [new MessageEmbed()
                .setTitle(`${client.config.BOTNAME} | User Removed`)
                .setColor("RED")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Remove a Member
                **Member Removed**: <@!${removido}>
                **Ticket Name**: ${interaction.channel.name}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)]}
        )
        }
        if(!client.config.TICKET.LOGS_SYSTEM) {
        return;
        }
    },
};
