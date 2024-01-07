const { Discord, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require("discord.js");
const client = require('../../index')

client.on("interactionCreate", async (interaction) => {

    
  
    if(interaction.isModalSubmit()){
        
        if(interaction.customId === "announcement" ){
            const announce = interaction.fields.getTextInputValue("announce-modal");

            const embed = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setTitle(`${client.config.BOTNAME} | Announce`)
                .setDescription(announce)

                interaction.reply({ content: 'Announce successfuly sent!', ephemeral: true})
                interaction.channel.send({ embeds: [embed]})
        }

  
    
    }
  })