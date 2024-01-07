const { MessageEmbed } = require('discord.js');
const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy')

module.exports = {
    name: "slot",
    description: "Slot machine.",
    options: [
    {
       name: "amount",
       description: "Amount of money to use.",
       type: "STRING",
       required: true
    },
    ],
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("slotmachine")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        let data = await ecoSchema.findOne({ userID: interaction.user.id });
        let amount = interaction.options.getString("amount")

        if (["todo", "all-in", "all"].includes(amount)) {
            amount = data.money
        } else {
            if (isNaN(amount) || amount  <= 0 || amount % 1 != 0) return interaction.reply({content: `${client.messages.ECONOMY.BET_NOT_SPECIFIED}`});

            if (amount > data.money) return interaction.reply({content: `${client.messages.ECONOMY.NO_MONEY}`});
        }

        let emojis = client.config.ECONOMY.SLOT_EMOJIS;
        let emoji = client.config.ECONOMY.SLOT_EMOJI;

        let _1 = emojis[Math.floor(emojis.length * Math.random())];
        let _2 = emojis[Math.floor(emojis.length * Math.random())];
        let _3 = emojis[Math.floor(emojis.length * Math.random())];
        let msg = `${interaction.user} apostó ${amount}!`.replace(`<userMention>`, `${interaction.user}`).replace(`<amount>`, `${amount}`)
        let msgwon = `${client.messages.ECONOMY.SLOT_WIN}`.replace(`<userMention>`, `${interaction.user}`).replace(`<amount>`, `${amount}`)
        let msglost = `${client.messages.ECONOMY.SLOT_LOST}`.replace(`<userMention>`, `${interaction.user}`).replace(`<amount>`, `${amount}`)
        const result = [];

        result.push(`${_1}` + "|" + ` ${emoji}`+ "|" + ` ${emoji}`)
        result.push(`${_1}` + "|" + ` ${_2}`+ "|" + ` ${emoji}`)
        result.push(`${_1}` + "|" + ` ${_2}`+ "|" + ` ${_3}`)

        const first = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`${msg}\n\n${emoji}` + ` ${emoji}`+ ` ${emoji}`)

        const second = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`${msg}\n\n${result[0]}`)

        const thrdt = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`${msg}\n\n${result[0]}\n${result[1]}`)

        const four = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`${msg}\n\n${result[0]}\n${result[1]}\n${result[2]}`)

        const won = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${msgwon}\n\n${result[0]}\n${result[1]}\n${result[2]}`)

        const lost = new MessageEmbed()
        .setColor('RED')
        .setDescription(`${msglost}\n\n${result[0]}\n${result[1]}\n${result[2]}`)

        interaction.reply({ content: 'Good luck!', ephemeral: true})

        let m = await interaction.channel.send({embeds: [first]})

    
            setTimeout(() => {
                m.edit({embeds:[second]})
            }, 600)
    
            setTimeout(() => {
                m.edit({ embeds: [thrdt]})
            }, 1200)
    
            setTimeout(() => {
                m.edit({ embeds: [four]})
            }, 1800)
         
            setTimeout(async () => {
        if(_1 == _2 && _1 == _3) {
            m.edit({ embeds: [won]})
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    money: amount
                }
            })
        } else {
            m.edit({ embeds: [lost]})
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    money: -amount
                }
            })
        }
    }, 2000)
        

        
    }
}