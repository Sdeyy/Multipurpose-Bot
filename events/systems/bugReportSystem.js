const client = require('../../index');
const { Discord, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
    if(!client.config.BUG_REPORT.ENABLED) return;

    if(interaction.isButton()){
        if(interaction.customId == "bugreportbtn"){
            const bugrepomodal = new Modal()
            .setTitle('Bug Report')
            .setCustomId(`bugreportmodal`)
            const t11 = new TextInputComponent()
            .setCustomId('bug')
            .setLabel(`Bug`)
            .setPlaceholder(`What is the bug?`)
            .setStyle('SHORT')
            .setRequired(true);
            const t12 = new TextInputComponent()
            .setCustomId('bugreportdesc')
            .setLabel(`Description`)
            .setPlaceholder(`Describe the bug`)
            .setStyle('PARAGRAPH')
            .setRequired(true);
            const t13 = new TextInputComponent()
            .setCustomId('bugreportprub')
            .setLabel(`Proofs`)
            .setPlaceholder(`Upload proofs to https://imgur.com/upload and paste the link here.`)
            .setStyle('PARAGRAPH')
            .setRequired(true);
    
            const ro1w = new MessageActionRow()
            .addComponents(t11);
            const ro2w = new MessageActionRow()
            .addComponents(t12);
            const ro3w = new MessageActionRow()
            .addComponents(t13);
    
            bugrepomodal.addComponents(ro1w, ro2w, ro3w);
            interaction.showModal(bugrepomodal);
        }
}})