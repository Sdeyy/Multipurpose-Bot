const Discord = require("discord.js")
const client = require("../../index.js");

client.on("interactionCreate", async(interaction) => {


      
    if(interaction.isButton()){
      if(interaction.customId === "verify"){

        let verifyRoles = client.config.VERIFY_SYSTEM.ROLES;

        if(!interaction.member.roles.cache.some(role => verifyRoles.includes(role.id))){ 

          await interaction.member.roles.add(verifyRoles)
          const teverificaste = new Discord.MessageEmbed()
          .setColor(client.embeds.Embeds.VERIFY_SUCCESSFULY.Color)
          .setTitle(`${client.embeds.Embeds.VERIFY_SUCCESSFULY.Title}`)
          .setDescription(`${client.embeds.Embeds.VERIFY_SUCCESSFULY.Description}`)

          interaction.reply({ embeds: [teverificaste], ephemeral: true})

        } else {

          const yaverify = new Discord.MessageEmbed()
            .setColor(client.embeds.Embeds.ALREADY_VERIFIED.Color)
            .setTitle(`${client.embeds.Embeds.ALREADY_VERIFIED.Title}`)
            .setDescription(`${client.embeds.Embeds.ALREADY_VERIFIED.Description}`)
          interaction.reply({ embeds: [yaverify], ephemeral: true})
          
        }



      }

      }
    })