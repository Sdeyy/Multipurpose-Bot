
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "8ball",
    description: "Ask the bot a question..",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'question',
            description: 'Question',
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

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("8ball")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
    const mensaje = interaction.options.getString('question');

    let respuestas = client.config.BALL.CONFIG;

 const ball = new Discord.MessageEmbed()
 .setColor(`${client.config.EMBEDCOLOR}`)
 .setTitle('**:8ball: 8BALL**')
 .setFooter(`Executed by: ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
 .addField(`**» Question:**`,` ${mensaje}`, false)
 .addField(`**» Answer:**`,` ${respuestas[( Math.floor(Math.random() * respuestas.length))]}.`, false)
 interaction.reply({ embeds : [ball] })
     


    },
};