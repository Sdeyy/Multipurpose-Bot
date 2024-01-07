const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy')
const duration = require('humanize-duration');
const client = require('../../index')
var works = client.config.ECONOMY.WORKS;

module.exports = {
    name: "work",
    description: "Work and get money.",
    category: "Economia",
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("work")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        let data = await ecoSchema.findOne({userID: interaction.user.id});

        let tiempo_ms = client.config.ECONOMY.WORK_COOLDOWN * 60 * 1000

        let money = Math.floor(Math.random() * 800) + 200;

        let work = works[Math.floor(Math.random() * works.length)];

        if(tiempo_ms - (Date.now() - data.work) > 0) {
            let time = duration(Date.now() - data.work - tiempo_ms,
            {
                language: "en",
                units: ["h", "m", "s"],
                round: true,
            })
            return interaction.reply({content: `${client.messages.ECONOMY.WORK_COOLDOWN}`.replace(`<time>`, `${time}`)})
        }
        await ecoSchema.findOneAndUpdate({userID: interaction.user.id}, {
            $inc: {
                money: money
            },
            work: Date.now()
        })
        return interaction.reply({content: `${client.messages.ECONOMY.WORK_WORKED}`.replace(`<work>`, `${work}`).replace(`<money>`, `${money}`)})
    }
}
