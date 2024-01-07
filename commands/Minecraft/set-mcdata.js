const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
const db = require('../../Models/mcdata')

module.exports = {
    name: 'set-mcdata',
    description: 'Set Minecraft Info.',
    options: [
        {
            name: 'ip',
            description: 'Server IP.',
            type: 'STRING',
            required: true
        },
        {
            name: 'store',
            description: 'Server Store.',
            type: 'STRING',
            required: true
        },
        {
            name: 'teamspeak',
            description: 'Server TeamSpeak.',
            type: 'STRING',
            required: true
        },
        {
            name: 'status',
            description: 'Server Status (online, offline, maintenance).',
            type: 'STRING',
            choices: [
                {
                    name: 'Online',
                    value: 'online'
                },
                {
                    name: 'Offline',
                    value: 'offline'
                },
                {
                    name: "Maintenance",
                    value: "maintenance"
                },
            ],
            required: true
        }
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {string[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("set-mcdata")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true})
        }
        const ip = interaction.options.getString('ip');
        const store = interaction.options.getString('store');
        const ts = interaction.options.getString('teamspeak');
        const status = interaction.options.getString('status');
    
        const data = await db.findOne({Guild: interaction.guild.id})
        console.log(db)
        console.log(data)
        if (!data) {
            await db.create({
                Guild: interaction.guild.id,
                Ip: ip,
                Store: store,
                Teamspeak: ts,
                Status: status
            })
            const changed = new MessageEmbed() 
            .setColor(client.config.EMBEDCOLOR)
            .setTitle(`${client.config.BOTNAME} Network Info`)
            .setDescription(`Hey <@${interaction.user.id}>, you successfully established the information about the network: \n\n » IP: **${ip}**\n » Store: **${store}**\n » TeamSpeak: **${ts}**\n » Status: **${status}**`)
            return interaction.reply({
                embeds: [
                    changed
                ]
            })
        } else {
            await db.findOneAndUpdate(
                {Guild: interaction.guild.id, Ip: ip,
                 Store: store,
                  Teamspeak: ts, 
                  Status: status})
            const changed = new MessageEmbed()
            .setColor(client.config.EMBEDCOLOR)
            .setTitle(`${client.config.BOTNAME} Network Info`)
            .setDescription(`Hey <@${interaction.user.id}>, you successfully changed the information about the network: \n\n » IP: **${ip}**\n » Store: **${store}**\n » TeamSpeak: **${ts}**\n » Status: **${status}**`)
            return interaction.reply({
                embeds: [
                    changed
                ]
            })
        }
    }
}
