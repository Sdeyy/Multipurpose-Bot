
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "stream",
    description: "Send a stream.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'link',
            description: 'Stream link.',
            type: 'STRING',
            required: true
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("stream")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        const url = interaction.options.getString('link');
        const streamChannel = client.config.STREAM.STREAM_CHANNEL;
        const streamRoles = client.config.STREAM.ACCESS_ROLES;

        if(!client.config.STREAM.ENABLED) return;

        if (!interaction.member.roles.cache.some(role => streamRoles.includes(role.id))) return;
        if(!url.includes("twitch")) return interaction.reply({ content: 'The message must contain a twitch link, example: https://twitch.tv/stream.', ephemeral: true});

        const embed = new MessageEmbed()
        .setColor('PURPLE')
        .setTitle('Stream Alert')
        .setDescription(`The user <@${interaction.user.id}> is live on twitch, you can see it by clicking the button below.\n`)

        const row = new Discord.MessageActionRow()
    .addComponents(
      [
      new Discord.MessageButton()
      .setLabel("Stream")
      .setStyle("LINK")
      .setURL(`${url}`)
      ],
    )

        interaction.reply({
            content: 'The live was advertised correctly!',
            ephemeral: true
        })
        interaction.guild.channels.cache.get(streamChannel).send({
            embeds: [embed],
            components: [row]
        })

    },
};