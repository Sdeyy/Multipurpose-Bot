
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')

module.exports = {
    name: "dick",
    description: "Dick Size.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("dick")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
     
        if (!interaction.guild.me.permissions.has('EMBED_LINKS')) {
            return interaction.reply({ content: mensajes["NO-PERMSBOT"], ephemeral: true})
        }
    
        let dick = [
            "No dick.",  
            "8=D",
            "8==D",
            "8===D",
            "8====D",
            "8=====D",
            "8======D",
            "8=======D",
            "8========D",
            "8===========D",
            ]

            const dickfinal = dick[Math.floor(Math.random() * dick.length)];

            const dickembed = new MessageEmbed()
                 .setDescription(`${interaction.user.username}'s dick\n${dickfinal}`)
                 .setColor(`${client.config.EMBEDCOLOR}`)
                 interaction.reply({
                     embeds: [dickembed]
            })

    },
};