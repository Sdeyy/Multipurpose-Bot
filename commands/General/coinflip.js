const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "coinflip",
    description: "Coinflip command",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("coinflip")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })
    
        let imagen = [
         'https://www.fundacionaquae.org/wp-content/uploads/2017/02/Bitcoin.png.webp',
         'https://static.currency.com/img/media/eth@2x.png'
        ]   
        var imagenrandom = imagen[Math.floor(imagen.length * Math.random())];

        const embed = new MessageEmbed() 
      .setTitle(`${interaction.user.username} flipped a coin 🪙`)
      .setDescription("**The coin has fallen in**")
      .setImage(imagenrandom)
      .setColor("RANDOM")
      .setFooter('Command used by  ' + interaction.user.username, interaction.user.displayAvatarURL())
      .setTimestamp()

  
        interaction.reply({embeds: [embed]})

    }
};
