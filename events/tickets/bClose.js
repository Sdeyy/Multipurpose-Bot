const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const client = require("../../index");

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()){
        if(interaction.customId === "Ticket-Open-Close") {

            let supportRole = client.config.TICKET.SUPPORT_ROLE;

            if(!interaction.member.roles.cache.has(supportRole)) return;

            if(interaction.channel.topic !== interaction.user.id) return interaction.reply({ content: 'You have to claim the ticket to close it. ', ephemeral: true})

            const idmiembro = interaction.channel.topic;
            let user = client.users.cache.get(idmiembro)

            interaction.deferUpdate();
       
        const embed = new MessageEmbed()
            .setDescription(client.messages.TICKET.WHAT_DO_YOU_WANT)
            .setColor(client.config.EMBEDCOLOR)


        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Transcript.Label)
                .setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Transcript.Style)
                .setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Transcript.Emoji)
                .setCustomId("Ticket-Transcript"),
            new MessageButton()
                .setLabel("Send Review")
                .setStyle("SUCCESS")
                .setEmoji("🌟")
                .setCustomId("Ticket-Review"),
            new MessageButton()
                .setLabel(client.buttons.TICKETS_GENERAL_BUTTONS.Delete.Label)
                .setStyle(client.buttons.TICKETS_GENERAL_BUTTONS.Delete.Style)
                .setEmoji(client.buttons.TICKETS_GENERAL_BUTTONS.Delete.Emoji)
                .setCustomId("Ticket-Delete")
        )
        
        interaction.channel.send({
            embeds: [embed],
            components: [row]
        }) 
    }
}
});