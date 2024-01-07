const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy')
const duration = require('humanize-duration');

module.exports = {
    name: "rob",
    description: "Steal coins from a user.",
    options: [
    {
        name: "user",
        description: "User to steal.",
        type: "USER",
        required: true
    },
    ],
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("rob")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const user = interaction.options.getUser("user")

        await saveAll(null, user.id);

        let data = await ecoSchema.findOne({ userID: interaction.user.id });

        let tiempo_ms = 20 * 60 * 1000;

        if (tiempo_ms - (Date.now() - data.rob) > 0) {
            let tiempo_restante = duration(Date.now() - data.rob - tiempo_ms,
                {
                    language: "en",
                    units: ["h", "m", "s"],
                    round: true,
                })
            return interaction.reply({content: `${client.messages.ECONOMY.ROB_COOLDOWN}`.replace(`<time>`, `${tiempo_restante}`)})
        }

        let data_user = await ecoSchema.findOne({ userID: user.id });
        if (data_user.money < client.config.ECONOMY.STOLEN_MIN_MONEY) return interaction.reply({content: `${client.messages.ECONOMY.CANNOT_STEAL}`})
        let amount = Math.floor(Math.random() * 400) + 100

        if (amount > data_user.money) return interaction.reply({content: `${client.messages.ECONOMY.STEAL_USER_NO_MONEY}`})
       
        await ecoSchema.findOneAndUpdate({ userID: interaction.user.id }, {
            $inc: {
                money: amount
            },
            rob: Date.now()
        })

        await ecoSchema.findOneAndUpdate({ userID: user.id }, {
            $inc: {
                money: -amount
            },
        })
        return interaction.reply({content: `${client.messages.ECONOMY.SUCCESSFULY_STOLEN}`.replace(`<amount>`, `${amount}`).replace(`<userTag>`, `${user.tag}`)})
    }
}