const { Discord, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require("discord.js");
const client = require('../../index')

client.on("interactionCreate", async (interaction) => {

    
  
    if(interaction.isModalSubmit()){
        
        if(interaction.customId === "embed" ){
            const title = interaction.fields.getTextInputValue("embed-title");
            const description = interaction.fields.getTextInputValue("embed-description");
            const color = interaction.fields.getTextInputValue("embed-color");
            const content = interaction.fields.getTextInputValue("embed-content")

            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)

                interaction.reply({ content: 'Embed successfully sent!', ephemeral: true})
                interaction.channel.send({ content: `${content}`, embeds: [embed]})
        }

  
    
    }
  })