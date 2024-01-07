const { Discord, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require("discord.js");
const client = require('../../index')

client.on("interactionCreate", async (interaction) => {
    
    if(interaction.isModalSubmit()){
        if(interaction.customId === "bugreportmodal" ){
        const bug = interaction.fields.getTextInputValue("bug");
        const desc = interaction.fields.getTextInputValue("bugreportdesc");
        const pruebas = interaction.fields.getTextInputValue("bugreportprub");
        const can = client.config.BUG_REPORT.CHANNEL_ID;
        const c = interaction.guild.channels.cache.get(can);
        
        if(!client.config.BUG_REPORT.ENABLED) return;
    
        const bugreport = new MessageEmbed()
        .setTitle("A new bug has been reported")
        .setDescription(`This bug was reported by: <@${interaction.user.id}> | ${interaction.user.id}
        
        Bug: ${bug}
        
        Description: ${desc}
        
        Proofs: ${pruebas}`)
        .setColor(client.config.EMBEDCOLOR)
        const embedsi = new MessageEmbed()
        .setTitle("Bug Reported Successfully")
        .setDescription("Thank you for reporting the bug, a staff member will review it.")
        .setFooter({ text: "You will not receive a response about this report."})
        .setColor("GREEN")
            
        interaction.reply({ embeds: [embedsi], ephemeral: true })
        c.send({ embeds: [bugreport] })
        }
  }})