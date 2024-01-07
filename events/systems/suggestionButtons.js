const client = require('../../index');
const { Discord, Modal, MessageActionRow, TextInputComponent, MessageEmbed, MessageButton } = require('discord.js');
const db = require('../../Models/suggestSchema.js');
const sugSchema = require('../../Models/votos-sugs');

client.on("interactionCreate", async interaction => {

    if(interaction.customId !== "acceptS" || interaction.customId !== "rejectS" ) return;
    
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: 'You dont have permission to use this function!', ephemeral: true})

    if(interaction.isButton()){
        if(interaction.customId == "acceptS"){
            
            modalReason(interaction, "Accept Suggestion", "modalsAccept", "sacceptr")
    
    } else if(interaction.customId == "rejectS"){

        modalReason(interaction, "Reject Suggestion", "modalsReject", "srejectr")
    }
}
 if(interaction.isModalSubmit()){

    if(interaction.customId !== "modalsAccept" || interaction.customId !== "modalsReject" ) return;

    const emojiYes = client.config.SUGGEST_SYSTEM.EMOJIS.UPVOTE;
    const emojiNo = client.config.SUGGEST_SYSTEM.EMOJIS.DOWNVOTE;
    const emojiVotes = client.config.SUGGEST_SYSTEM.EMOJIS.VOTES;

    const data = await db.findOne({ message: interaction.message.id})
    const suggestion = data.suggestion;
    const token = data.token;
    const user = data.user;
    const member = interaction.guild.members.cache.get(user);

    let msg_data = await sugSchema.findOne({ messageID: interaction.message.id });

    let row = new MessageActionRow().addComponents([
        new MessageButton().setStyle("SUCCESS").setLabel(msg_data.si.length.toString()).setEmoji(emojiYes).setDisabled(true).setCustomId("votar_si"),
        new MessageButton().setStyle("DANGER").setLabel(msg_data.no.length.toString()).setEmoji(emojiNo).setDisabled(true).setCustomId("votar_no"),
        new MessageButton().setStyle("PRIMARY").setLabel("Votes").setEmoji(emojiVotes).setCustomId("ver_votos"),
    ])

    let row2 = new MessageActionRow().addComponents([
        new MessageButton().setStyle("SUCCESS").setLabel("Accept").setCustomId("acceptS"),
        new MessageButton().setStyle("DANGER").setLabel("Reject").setCustomId("rejectS")
    ])
    

    if(interaction.customId == "modalsAccept"){

        const reason = interaction.fields.getTextInputValue("sacceptr");
        
        const embedAccepted = new MessageEmbed()
        .setTitle(`${client.config.BOTNAME} | Suggestions`)
        .setColor('GREEN')
        .setDescription(`This suggestion has already been answered.`)
        .addField(`Member:`, `${member.user.tag}`)
        .addField(`Status:`, `Accepted by ${interaction.user.username}`)
        .addField(`Reason:`, `${reason}`)
        .addField(`Suggestion`, `${suggestion}`)
        .setFooter(`${member.user.tag} suggestion | ID: ${token}`, member.displayAvatarURL());

        interaction.message.edit({ embeds: [embedAccepted], components: [row, row2]})
        interaction.reply({ content: 'Suggestion successfully accepted!', ephemeral: true})


    } else if(interaction.customId == "modalsReject"){

        const reasonReject = interaction.fields.getTextInputValue("srejectr");

        const embedRejected = new MessageEmbed()
        .setTitle(`${client.config.BOTNAME} | Suggestions`)
        .setColor('RED')
        .setDescription(`This suggestion has already been answered.`)
        .addField(`Member:`, `${member.user.tag}`)
        .addField(`Status:`, `Rejected by ${interaction.user.username}`)
        .addField(`Reason:`, `${reasonReject}`)
        .addField(`Suggestion`, `${suggestion}`)
        .setFooter(`${member.user.tag} suggestion | ID: ${token}`, member.displayAvatarURL());

        interaction.message.edit({ embeds: [embedRejected], components: [row, row2]})
        interaction.reply({ content: 'Suggestion successfully rejected!', ephemeral: true})
    }


 }
})


async function modalReason(interaction, modalTitle, modalID, inputID){


    const modal = new Modal()
    .setTitle(`${modalTitle}`)
    .setCustomId(`${modalID}`)

    const announce = new TextInputComponent()
    .setCustomId(`${inputID}`)
    .setLabel(`What is the reason?`)
    .setStyle(`PARAGRAPH`)
    .setRequired(true)
    
    const row1 = new MessageActionRow()
    .addComponents(announce);

    modal.addComponents(row1);

    await interaction.showModal(modal);

}