const client = require('../../index.js')
const {CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "serverinfo",
    description: "Server information.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("serverinfo")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const ownerserver = interaction.guild.ownerId;
        const ServerLogo = interaction.guild.iconURL();

        const invite = new Discord.MessageEmbed()
                    .setColor(`${client.config.EMBEDCOLOR}`)
                    .setTitle("Server Information")
                    .setImage(ServerLogo)
                    .setDescription(`About **${interaction.guild}**`)
                    .addField("**Created**", `The server was created on **${interaction.guild.createdAt.toLocaleString()}**`)
                    .addField("**Owner**", `The server owner is <@${ownerserver}>`)
                    .addField("**Members**", "This server has ` " + `${interaction.guild.memberCount}` + " ` **Members**")
                    .addField("**Emojis**", "This server has ` " + `${interaction.guild.emojis.cache.size}` + " ` **Emojis**")
                    .addField("**Roles**", "This server has ` " + `${interaction.guild.roles.cache.size}` + " ` **Roles**")
                    .addField("**Channels**", "This server has ` " + `${interaction.guild.channels.cache.size}` + " ` **Channels**")
     interaction.reply({
       embeds:[invite]
     })

    },
};