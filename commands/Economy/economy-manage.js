const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { isFunction } = require("util");
const ecoSchema = require('../../Models/economy')

module.exports = {
    name: "economy-manage",
    description: "Manage user money.",
    options: [
        {
            name: "set-money",
            description: "Set money to a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to set money.",
                    type: "USER",
                    required: true
                },
                {
                    name: "money",
                    description: "Money to set to the user.",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "add-money",
            description: "Add money to a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to add money",
                    type: "USER",
                    required: true
                },
                {
                    name: "money",
                    description: "Money to add to the user.",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "remove-money",
            description: "Remove money to a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to remove money",
                    type: "USER",
                    required: true
                },
                {
                    name: "money",
                    description: "Money to remove to the user.",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("economy-manage")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const Sub = interaction.options.getSubcommand(["set-money", "add-money", "remove-money"]);
        const user = interaction.options.getMember('user');
        const money = interaction.options.getNumber('money');

        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

        const data = await ecoSchema.findOne ({ userID: user.id })

            switch(Sub){
                case "set-money":

                    await ecoSchema.findOneAndUpdate({userID: user.id}, {
                            money: money
                        })

                    const moneySet = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${user} money was set to ${money}!`.replace('<user>', `${user}`).replace('<money>', `${money}`))

                    interaction.reply({embeds: [moneySet]})

                break;
                case "add-money":
                
                    const moneyAdd = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${money} coins were added to ${user} balance!`.replace('<user>', `${user}`).replace('<money>', `${money}`))

                    interaction.reply({embeds: [moneyAdd]})

                    await ecoSchema.findOneAndUpdate({userID: user.id}, {
                        $inc: {
                            money: money
                        } })

                break;
                case "remove-money":

                    
                    if(data.money - money < 0) return interaction.reply({ content: 'You can not put user in negative balance!', ephemeral: true})
                    
                    const moneyRemove = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`${money} coins were removed from ${user} balance!`.replace('<user>', `${user}`).replace('<money>', `${money}`))

                    interaction.reply({embeds: [moneyRemove]})

                    await ecoSchema.findOneAndUpdate({userID: user.id}, {
                        $inc: {
                            money: -money
                        } })

                break;
      


         }
        }
    }
