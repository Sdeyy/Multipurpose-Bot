
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
module.exports = {
    name: "happy",
    description: "User happy",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("happy")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const star = require('star-labs');
 
  const aA = interaction.user
  const aB = new Discord.MessageEmbed()
  .setColor(`${client.config.EMBEDCOLOR}`)
    .setDescription(aA.tag+' is very happy!')
    .setImage(star.happy())
    .setTimestamp();
  interaction.reply({ embeds: [aB] })


    },
};