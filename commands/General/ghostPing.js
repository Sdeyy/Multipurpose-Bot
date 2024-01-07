const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ghostping",
    description: "Ghost ping.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "role",
            description: "Role",
            type: "ROLE",
            required: true
        },
        {
            name: "channel",
            description: "Channel",
            type: "CHANNEL",
            required: false 
        }
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("ghostping")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: 'You dont have permissions!', ephemeral: true})

        const successEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription('Ghostping sent correctly!')

        interaction.reply({ embeds: [successEmbed], ephemeral: true })
        channel.send({ content: `${role}`}).then(m => {
            setTimeout(() => {
                m.delete()
            }, 1000)
        })

    }
};
