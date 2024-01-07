const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const client = require('../../index');
const Discord = require('discord.js');
const fs = require('fs');
const VirusTotalApi = require("virustotal-api");
const virusTotal = new VirusTotalApi(client.config.VIRUS_TOTAL.API_KEY);


module.exports = {
    name: "check-virus",
    description: "Check file.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'file',
            description: 'File to check virus',
            type: "ATTACHMENT",
            required: "true"
        },

    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("check-virus")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        const file = interaction.options.getAttachment("file")


            virusTotal
              .fileScan(file)
              .then(response => {
                let resource = response.resource;
                virusTotal.fileReport(resource).then(result => {
                  console.log(result);
                  if(result.positives == 0){
                    const noDanger = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription('This file does not represent any type of treath.')
                    .addField('Total Analysis', `${result.total}`)
                    .addField('Positive Analysis', `${result.positives}`)

                    interaction.reply({embeds: [noDanger]})
                  } else{
                    const danger = new MessageEmbed()
                    .setColor('RED')
                    .setDescription('⚠️Attention, this file could represent a threath.')
                    .addField('Total Analysis', `${result.total}`)
                    .addField('Positive Analysis', `${result.positives}`)

                    interaction.reply({embeds: [danger]})
                  }
                });
              })


    },
};