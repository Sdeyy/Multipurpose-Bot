
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "kiss",
    description: "Kiss a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'User do you want to kiss.',
            type: 'USER',
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

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("kiss")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const aB = interaction.options.getUser('user');

const star = require('star-labs');
 
  let aA = interaction.user
  const aC = new Discord.MessageEmbed()
    .setColor(`${client.config.EMBEDCOLOR}`)
    .setDescription(aA.tag+' Kissed '+aB.tag)
    .setImage(star.kiss())
    .setTimestamp();
  interaction.reply({ embeds: [aC]})


    },
};