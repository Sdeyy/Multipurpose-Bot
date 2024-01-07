
const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')

module.exports = {
    name: "help",
    description: "Help  command.",
    type: 'CHAT_INPUT',


    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("help")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const row = new Discord.MessageActionRow()
.addComponents(
	new Discord.MessageSelectMenu()
	.setCustomId("menu_prueba")
	.setMinValues(1)
	.setMaxValues(1)
	.addOptions([
		{
		label:"General",
		description: "General Commands",
		value:"1",
		emoji: "📦"
		},

		{
		label:"Moderation",
		description: "Moderation Commands",
		value:"2",
		emoji: "👮"
		},
        {
            label:"Admin",
            description: "Admin Commands",
            value: "3",
            emoji: "🛠️"
        },

    {
		label:"Other",
		description: "Other Commands",
		value:"4",
		emoji: "🔧"
		},
    {
		label:"Music",
		description: "Music Commands",
		value:"5",
		emoji: "🎵"
		},


		])


	)

  const principal = new Discord.MessageEmbed()
      .setColor(`${client.config.EMBEDCOLOR}`)
      .setTitle("Select a option to view a commands")
      .setDescription(`📦 General Commands\n\n👮 Moderation Commands\n\n🛠️ Admin Commands\n\n🔧 Other Commands\n\n🎵 Music Commands`)



const fun = new Discord.MessageEmbed()
      .setTitle("📦 General Commands 📦")
      .setDescription("`8ball` `announce` `avatar` `cry` `dick` `embed` `giveaway` `happy` `help` `hug` `kiss` `ping` `poll` `say` `serverinfo` `suggestion` `userinfo`")
      .setColor(`${client.config.EMBEDCOLOR}`)

      const util = new Discord.MessageEmbed()
      .setTitle("👮 Moderation Commands 👮")
      .setDescription("`blacklistwords` `notes` `nuke` `punish` `set-muterol` `warnings`")
      .setColor(`${client.config.EMBEDCOLOR}`)

      const info = new Discord.MessageEmbed()
      .setTitle("🛠️ Admin Commands 🛠️")
      .setDescription("`backup (Owner Only)` `panel-send` `reaction-roles` `setroles`")
      .setColor(`${client.config.EMBEDCOLOR}`)
    
      const mod = new Discord.MessageEmbed()
      .setTitle("🔧 Other Commands 🔧")
      .setDescription("`demote` `forceban` `nick` `password` `promote` `stream` `ip` `set-mcdata` `store` `teamspeak`")
      .setColor(`${client.config.EMBEDCOLOR}`)
      

      const music = new Discord.MessageEmbed()
      .setTitle("🎵 Music Commands 🎵")
      .setDescription("`play` `pause` `continue` `skip` `queue` `disconnect` `volume` `loop`")
      .setColor(`${client.config.EMBEDCOLOR}`)

const m = await interaction.reply({ embeds: [principal], components: [row], fetchReply: true })

const filter = (i) => i.user.id === interaction.user.id

const collector = m.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60000 });

collector.on("collect", async (i) => {
	if(i.values[0] === "1"){

	i.update({ embeds: [fun], components: [row]})
	
	
	}if(i.values[0] === "2"){

	i.update({ embeds: [util], components: [row]})
    
    }if(i.values[0] === "3"){
        i.update({ embeds: [info], components: [row]})
        
    }if(i.values[0] === "4"){

	  i.update({ embeds: [mod], components: [row]})
	
	
	}if(i.values[0] === "5"){

	i.update({ embeds: [music], components: [row]})
	
	
	}

    const timedout = new Discord.MessageEmbed()
    .setColor(client.config.EMBEDCOLOR)
    .setDescription(`:x: Timed Out`)
    collector.on('end', () => {
        interaction.editReply({embeds: [timedout], components: []})
    })
	})
      

      

 
        
  


 

    },
};