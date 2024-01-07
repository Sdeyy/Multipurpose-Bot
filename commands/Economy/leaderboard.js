const {pagination} = require(`../../functions/pagination`);
const ecoSchema = require('../../Models/economy');

module.exports = {
    name: "leaderboard",
    description: "See users with more money",
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("leaderboard")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

      cm = client.config.ECONOMY.LEADERBOARD_MEDALS;

      var medals = {
    1: `${cm[0]}`,
    2: `${cm[1]}`,
    3: `${cm[2]}`,
}

        const total = await ecoSchema.find();
        await interaction.guild.members.fetch();

        const ordenado = total.filter(member => interaction.guild.members.cache.get(member.userID)).sort((a, b) => Number((b.money+b.bank) - (a.money+a.bank)));

        const texto = ordenado.map((miembro, index) => `${medals[index+1] ?? ""} \`${index+1}\` - <@${miembro.userID}> *\`${interaction.guild.members.cache.get(miembro.userID).user.tag}\`*\n**Money:** \`${miembro.money}\`\n**Bank:** \`${miembro.bank}\`\n\n`)

        pagination(client, interaction, texto, "💸 ECONOMY LEADERBOARD 💸")
    }
}