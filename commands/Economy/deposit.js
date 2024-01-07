const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy');

module.exports = {
    name: "deposit",
    description: "Deposit money in the bank",
    options: [
    {
      name: "amount",
      description: "Amount to deposit",
      type: "STRING",
      required: true
    },
    ],
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("deposit")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        let data = await ecoSchema.findOne({userID: interaction.user.id});
        let amount = interaction.options.getString("amount")

        if(["todo", "all-in", "all"].includes(amount)) {
            amount = data.money
        } else {
            if(isNaN(amount) || amount <= 0 || amount % 1 != 0) return interaction.reply({content: `${client.messages.ECONOMY.DEPOSIT_INVALID_AMOUNT}`});
            if(amount > data.money) return interaction.reply({content: `${client.messages.DEPOSIT_NO_MONEY}`});
        }
       await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
           $inc: {
               money: -amount,
               bank: amount
           }
       });
       return interaction.reply({content: `${client.messages.ECONOMY.SUCCESSFULY_DEPOSITED}`.replace(`<amount>`, `${amount}`)});
    }
}