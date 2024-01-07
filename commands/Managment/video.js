
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "video",
    description: "Send a video.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'link',
            description: 'Video link.',
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
        
        if(client.config.DISABLE_COMMANDS.DISABLED.includes("video")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const url = interaction.options.getString('link');
        const videoChannel = client.config.VIDEO.VIDEO_CHANNEL;
        const videoRoles = client.config.VIDEO.ACCESS_ROLES;
        const mention = client.config.VIDEO.MENTION;

        if (!interaction.member.roles.cache.some(role => videoRoles.includes(role.id)) || !interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("You dont have permissions to execute this command!");
        if(!url.includes("youtube" || "youtu.be" || "tiktok.com" || "vm.tiktok.com")) return interaction.reply({ content: 'The message must contain a youtube link, example: https://youtube.com.', ephemeral: true});

        const embed = new MessageEmbed()
        .setColor("PURPLE")
        .setTitle('Video Alert')
        .setDescription(`The user <@${interaction.user.id}> posted a new video, go check it out.`)

        const row = new Discord.MessageActionRow()
    .addComponents(
      [
      new Discord.MessageButton()
      .setLabel("Video")
      .setStyle("LINK")
      .setURL(`${url}`)
      ],
    )

        interaction.reply({
            content: 'The video was advertised correctly!',
            ephemeral: true
        })
        interaction.guild.channels.cache.get(videoChannel).send({
            embeds: [embed],
            components: [row],
        })
    },
};