const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy');
const duration = require('humanize-duration');

module.exports = {
    name: "daily",
    description: "Claim a daily reward.",

    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("daily")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        let data = await ecoSchema.findOne({userID: interaction.user.id});

        let time_ms = 24 * 60 * 60 * 1000
        let reward = 350;

        if(tiempo_ms - (Date.now() - data.daily) > 0) {
            let time = duration(Date.now() - data.daily - time_ms,
            {
                language: "en",
                units: ["h", "m", "s"],
                round: true,
            })
            return interaction.reply({content: `${client.messages.ECONOMY.DAILY_COOLDOWN}`.replace(`<time>`, `${time}`)})
        }
        await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
            $inc: {
                money: reward
            },
            daily: Date.now()
        })
        return interaction.reply({content: `${client.messages.DAILY_CLAIMED}`.replace(`<amount>`, `${reward}`)})
    }
}