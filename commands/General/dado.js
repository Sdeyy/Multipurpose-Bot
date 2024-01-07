const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "dado",
    description: "Dado command",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("dado")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

    let links = ["https://freesvg.org/img/dado-1.png",
        "https://th.bing.com/th/id/OIP.n3OXMmlEHu2-MJlnJQvIJQHaHa?pid=ImgDet&rs=1",
        "https://th.bing.com/th/id/R.16130f28b664b61fe850bb70cb928c2d?rik=tZGsMB09BUjsEA&pid=ImgRaw&r=0", 
        "https://freesvg.org/img/dado-4.png",
        "https://th.bing.com/th/id/OIP.-oyiM0OqmuQ-uoURMs9aFAHaHR?pid=ImgDet&rs=1",
        "https://th.bing.com/th/id/OIP.InOLCX7wqJfZs-PNhAtpAwHaHR?pid=ImgDet&rs=1"]
  
    var dado = links[Math.floor(Math.random() * links.length)]

    const embed = new MessageEmbed() 
    .setTitle(`${interaction.user.username} has rolled the dado.`)
    .setDescription('The dado has fallen in:')
    .setImage(dado) 
    .setFooter("Command used by " + interaction.user.username, interaction.user.displayAvatarURL())
    .setColor("RANDOM")
    .setTimestamp()

    interaction.reply({ embeds: [embed] })
    }
};
