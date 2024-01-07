const {saveAll} = require(`../../functions/saveAll`);
const ecoSchema = require('../../Models/economy');
const Discord = require('discord.js');
const client = require('../../index');

module.exports = {
    name: "balance",
    description: "See all the money you got.",
    options: [
    {
       name: "user",
       description: "View user balance.",
       type: "USER",
       required: false
    },
    ],
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("balance")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const user = interaction.options.getUser("user") || interaction.user;
        if(user.bot) return interaction.reply({content: `${client.messages.ECONOMY.BOTS_MONEY}`});

        await saveAll(null, user.id);

        let data = await ecoSchema.findOne({userID: user.id});

        interaction.reply({
            embeds: [new Discord.MessageEmbed()
            .setAuthor({name: `${client.embeds.Embeds.ECONOMY_BALANCE.Author}`.replace(`<userTag>`, `${user.tag}`), iconURL: user.displayAvatarURL({dynamic: true})})
            .setDescription(`${client.embeds.Embeds.ECONOMY_BALANCE.Description}`.replace(`<coinsMoney>`, `${data.money}`).replace(`<bankMoney>`, `${data.bank}`))
            .setColor(client.config.EMBEDCOLOR)
            ]
        }).catch(err => {
          return interaction.reply({content: `${client.messages.ECONOMY.USER_NOT_REGISTERED}`})
        })
    }
}