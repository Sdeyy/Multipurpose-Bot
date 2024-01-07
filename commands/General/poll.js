
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "poll",
    description: "Create a poll.",
    type: 'CHAT_INPUT',
    options: [

        {
            name: 'question',
            description: 'question',
            type: "STRING",
            required: true
        },
        {
            name: 'option1',
            description: 'First Option',
            type: "STRING",
            required: "true"
        },
        {
            name: 'option2',
            description: 'Second Option',
            type: "STRING",
            required: "true"
        },
        {
            name: 'option3',
            description: 'Third Option',
            type: "STRING"
        },
        {
            name: 'option4',
            description: 'Four Option',
            type: "STRING"
        },
        {
            name: 'option5',
            description: 'Five Option',
            type: "STRING"
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("poll")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({content: `${messages.NO_PERMSUSER}`, ephemeral: true})
        }
        
        const question = interaction.options.getString('question');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');
        const option3 = interaction.options.getString('option3') || null;
        const option4 = interaction.options.getString('option4') || null; 
        const option5 = interaction.options.getString('option5') || null;

        const correct = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription('The poll was created successfully!')

        const embed1 = new Discord.MessageEmbed()
        .setColor(`${client.config.EMBEDCOLOR}`)
        .setTitle(`${client.config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}`)

        const embed2 = new Discord.MessageEmbed()
        .setColor(`${client.config.EMBEDCOLOR}`)
        .setTitle(`${client.config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}\n\n:three: | ${option3}`)

        const embed3 = new Discord.MessageEmbed()
        .setColor(`${client.config.EMBEDCOLOR}`)
        .setTitle(`${client.config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}\n\n:three: | ${option3}\n\n:four: | ${option4}`)

        const embed4 = new Discord.MessageEmbed()
        .setColor(`${client.config.EMBEDCOLOR}`)
        .setTitle(`${client.config.BOTNAME} | Poll`)
        .setDescription(`**${question}**\n\n:one: | ${option1}\n\n:two: | ${option2}\n\n:three: | ${option3}\n\n:four: | ${option4}\n\n:five: | ${option5}`)

        if(!option3) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed1]}).then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
            })
        }

        if(!option4) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed2]}).then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('3️⃣')
            })
            
        } 

        if(!option5) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed3]}).then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('3️⃣')
                msg.react('4️⃣')
            })
        } 

        if(option5) {
            interaction.reply({ embeds: [correct], ephemeral: true})
            return interaction.channel.send({ embeds: [embed4]}) .then(msg => {
                msg.react('1️⃣')
                msg.react('2️⃣')
                msg.react('3️⃣')
                msg.react('4️⃣')
                msg.react('5️⃣')
            })
        }
  


 

    },
};