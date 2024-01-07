const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Discord } = require("discord.js");
const db = require('../../Models/userStatistics');
module.exports = {
    name: "userinfo",
    description: "user information.",
    type: "CHAT_INPUT",
    options: [
      {
        name: "user",
        description: "user.",
        type: "USER",
        required: false,
      },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     */
     run: async (client, interaction, args) => {

      if(client.config.DISABLE_COMMANDS.DISABLED.includes("userinfo")) return interaction.reply({ 
        content: `${client.messages.DISABLED_COMMAND}`, 
        ephemeral: true
    })

      const user = interaction.options.getMember('user') || interaction.member;
     
      let warnings, bans;

      const statsData = await db.findOne({ guildID: interaction.guild.id, userID: user.id })

      if(!statsData){
        await db.create({  guildID: interaction.guild.id})
      } 

       try {
        warnings = statsData.warnings;
        bans = statsData.bans;
       } catch (error) {
        warnings = 0;
        bans = 0;
       }


      const userinfo = new MessageEmbed()
      .setColor(client.config.EMBEDCOLOR)
      .setTitle('User Information')
      .setThumbnail(user.displayAvatarURL())
      .setDescription(` ⚠️ » Warnings: ${warnings}\n🔨 » Bans: ${bans}`)
      .addField("Username", `${user.user.username}`, true)
      .addField("User ID", `${user.id}`, true)
      .addField(`Nickname : `, `**${user.nickname || `Default`}**`, true)
      .addField("Server Member Since", `<t:${parseInt(user.joinedTimestamp / 1000, 10)}:R>`, true)
      .addField("Discord User Since", `<t:${parseInt(user.user.createdTimestamp / 1000, 10)}:R>`, true)
      .addField(`Presence : `, `**${user.presence?.status || `offline`}**`, true)

      await interaction.reply({ embeds: [userinfo]});
  
    }
  }