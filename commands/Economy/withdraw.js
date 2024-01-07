const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy')

module.exports = {
    name: "withdraw",
    description: "Withdraw money from the bank.",
    category: "Economia",
    options: [
    {
      name: "amount",
      description: "Amount of money to withdraw.",
      type: "STRING",
      required: true
    },
    ],
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("withdraw")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        let data = await ecoSchema.findOne({userID: interaction.user.id});
        let amount = interaction.options.getString("amount")

        if(["todo", "all-in", "all"].includes(args[0])) {
            amount = data.bank
        } else {
            if(isNaN(amount) || amount <= 0 || amount % 1 != 0) return interaction.reply({content: `${client.messages.ECONOMY.WITHDRAW_INVALID_AMOUNT}`});
            if(amount > data.bank) return interaction.reply({content: `${client.messages.ECONOMY.WITHDRAW_NO_MONEY}`});
        }
       await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
           $inc: {
               bank: -amount,
               money: amount,
           }
       });
       return interaction.reply({content: `${client.messages.ECONOMY.SUCCESFULLY_WITHDRAW}`.replace(`<amount>`, `${amount}`)});
    }
}