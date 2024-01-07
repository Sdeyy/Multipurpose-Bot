const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "rename",
    description: "Rename ticket.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'name',
            description: 'Example: example-<ticketUser>',
            type: 'STRING',
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

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("rename")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        if(!interaction.member.roles.cache.has(`${client.config.TICKET.SUPPORT_ROLE}`)) return 
        interaction.reply({ content: 'You dont have permissions to use it!', ephemeral: true})
        const renameTicket = interaction.options.getString('name');
        const topic = interaction.channel.topic;
        
        const userCheck = interaction.guild.members.cache.get(topic);

        if(!userCheck){
            const noTicket = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${client.messages.TICKET.NO_TICKET}`.replace('<user>', `${interaction.user}`))
                
            return interaction.reply({ embeds: [noTicket], ephemeral: true})
        } 

        const deleting = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${client.messages.TICKET.TICKET_RENAMED}`.replace('<rename>', `${renameTicket}`).replace('<ticketUser>', `${userCheck.user.username}`))

        interaction.reply({ embeds: [deleting]})

        interaction.channel.setName(`${renameTicket}`.replace('<ticketUser>', `${userCheck.user.username}`))

    },
};