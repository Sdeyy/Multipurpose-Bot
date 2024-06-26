const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Discord } = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const messages = yaml.load(fs.readFileSync('settings/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))

module.exports = {
    name: "pause",
    description: "Pause song.",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("pause")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const canalvoz = new MessageEmbed()
        .setColor('RED')
        .setDescription('You must be on a voice channel.')
    
        const canalvoz2 = new MessageEmbed()
        .setColor('RED')
        .setDescription('You must be on the same voice channel as me.')
    
        const nocanciones = new MessageEmbed()
        .setColor('RED')
        .setDescription('There are no songs on the list.')
    
        const yapausada = new MessageEmbed()
        .setColor('RED')
        .setDescription('The song is already paused.')

        const pausada = new MessageEmbed()
        .setColor('GREEN')
        .setDescription('The song was paused successfully.')

        if(!interaction.member.voice.channel) return interaction.reply({ embeds: [canalvoz], ephemeral: true})
        if(interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({ embeds: [canalvoz2], ephemeral: true})
    
    
    const queue = client.distube.getQueue(interaction.member.voice.channel)
    if(!queue) return interaction.reply({ embeds: [nocanciones], ephemeral: true})
    
    
    if(!queue.pause){
      interaction.reply({ embeds: [yapausada], ephemeral: true})
      return;
    }
    
    try{
      client.distube.pause(interaction.member.voice.channel)
      interaction.reply({ embeds: [pausada]})
      return;
    } catch (e) {
      interaction.reply({content: `Error: **${e}**`})
    }
    
    },
};