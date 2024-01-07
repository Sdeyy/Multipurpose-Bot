
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
module.exports = {
    name: "hug",
    description: "Hug a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'User do you want to hug.',
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

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("hug")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const star = require('star-labs');

        const aB = interaction.options.getUser('user');
     
        let aA = interaction.user;

      const aC = new Discord.MessageEmbed()
      .setColor(`${client.config.EMBEDCOLOR}`)
        .setDescription(aA.tag+' hugged '+aB.tag)
        .setImage(star.hug())
        .setTimestamp();
      interaction.reply({embeds: [aC]});
        
        

    },
};