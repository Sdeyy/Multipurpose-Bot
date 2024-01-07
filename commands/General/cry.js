
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "cry",
    description: "Send a gif crying",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("cry")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const star = require('star-labs');
 
  const aA = interaction.user
  const aB = new Discord.MessageEmbed()
    .setColor(`${client.config.EMBEDCOLOR}`)
    .setDescription(aA.tag+' ha comenzado a llorar! :(')
    .setImage(star.cry())
    .setTimestamp();
  interaction.reply({ embeds: [aB]});
        

    },
};