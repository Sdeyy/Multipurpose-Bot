const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy')

module.exports = {
    name: "bet",
    description: "Bet an amount of money.",
    options: [
    {
       name: "amount",
       description: "Amount of money to bet.",
       type: "STRING",
       required: true
    },
    ],
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("bet")) return interaction.reply({ 
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

        let probability = ["win", "lost"];

        let result = probability[Math.floor(Math.random() * probability.length)];

        if (result === "win") {
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    money: amount
                }
            })
            return interaction.reply({content: `${client.messages.ECONOMY.BET_WIN}`.replace(`<amount>`, `${amount}`)})
        } else {
            await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
                $inc: {
                    money: -amount
                }
            })
            return interaction.reply({content: `${client.messages.ECONOMY.BET_LOST}`.replace(`<amount>`, `${amount}`)})
        }
    }
}