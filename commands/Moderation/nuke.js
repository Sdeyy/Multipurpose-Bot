
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "nuke",
    description: "Nuke a chat.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("nuke")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const noperms = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`${client.messages.NO_PERMSUSER}`)
    
    
      if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply(client.messages.NO_PERMSBOT + `**MANAGE_CHANNELS**`)
        }
      if(!interaction.member.permissions.has("MANAGE_CHANNELS")) {
        return interaction.reply({ embeds: [noperms], ephemeral: true})
      }
    
        let positionn = interaction.channel.position
      
        interaction.channel.clone().then((canal) => {
      
        interaction.channel.delete()
      
        canal.setPosition(positionn)
    
        const embed = new Discord.MessageEmbed()
        .setTitle(`:warning: | CHAT NUKED `)
        .setImage("https://media.discordapp.net/attachments/901716135274246204/904578405599686656/explosion.gif")
        .setFooter(`Chat nuked by: ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('RED')
        canal.send({
          embeds: [embed]
        })
      
        });


    },
};