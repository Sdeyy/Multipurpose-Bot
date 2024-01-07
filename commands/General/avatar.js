
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "avatar",
    description: "User avatar.",
    type: 'CHAT_INPUT',
    options: [
        {
          name: "user",
          description: "User avatar.",
          type: "USER",
          required: false,
        },
      ],


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("avatar")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

        if(!interaction.guild.me.permissions.has(['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']))return interaction.reply(`${messages.NO_PERMSBOT}`)

        let miembro = interaction.options.getUser('user') || interaction.user
        
        const emb = new Discord.MessageEmbed()
            .setDescription(`**Download the avatar of ${miembro.tag}**`)
        .setImage(`${miembro.displayAvatarURL({dynamic: true, size : 1024 })}`)
            .setColor(`${client.config.EMBEDCOLOR}`)
        
        const row = new Discord.MessageActionRow()
    .addComponents(
      [
      new Discord.MessageButton()
      .setLabel("PNG")
      .setEmoji("<:Enlace:915425891281149952>")
      .setStyle("LINK")
      .setURL(`${miembro.displayAvatarURL({ format: 'png', dynamic: true, size : 1024 })}`)
      ],
      [
        new Discord.MessageButton()
        .setLabel("JPG")
        .setEmoji("<:Enlace:915425891281149952>")
       .setStyle("LINK")
       .setURL(`${miembro.displayAvatarURL({ format: 'jpg', dynamic: true, size : 1024 })}`)
      ],
      [
       new Discord.MessageButton()
      .setLabel("JPEG")
      .setEmoji("<:Enlace:915425891281149952>")
      .setStyle("LINK")
       .setURL(`${miembro.displayAvatarURL({ format: 'jpeg', dynamic: true, size : 1024 })}`)
      ]
    )

    interaction.reply({ 
    embeds: [emb],
    components: [row]})

   }
}