const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const db = require('../../Models/levelModel');

module.exports = {
    name: "level-manage",
    description: "Manage user level.",
    options: [
        {
            name: "set-level",
            description: "Set level to a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to set level.",
                    type: "USER",
                    required: true
                },
                {
                    name: "level",
                    description: "Level to set to the user.",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "set-xp",
            description: "Set xp to a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to set xp",
                    type: "USER",
                    required: true
                },
                {
                    name: "xp",
                    description: "xp to set to the user.",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "set-xplimit",
            description: "Set xp limit to a user.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to set xp limit",
                    type: "USER",
                    required: true
                },
                {
                    name: "xp_limit",
                    description: "XP limit to set to the user.",
                    type: "NUMBER",
                    required: true
                }

            ],
        },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("level-manage")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        const Sub = interaction.options.getSubcommand(["set-level", "set-xp", "set-xplimit"]);

        const user = interaction.options.getMember('user');
        const level = interaction.options.getNumber('level');
        const xp = interaction.options.getNumber('xp');
        const xpLimit = interaction.options.getNumber('xp_limit');
        const data = await db.findOne({ guildID: interaction.guild.id, userID: user.id });

        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

            switch(Sub){

            case "set-level":


        
                const levelSuccess = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setTitle('Level System')
                .setDescription('Level has been set correctly!')
                .addField('User', `${user}`, true)
                .addField('New Level', `${level}`, true)

                
            
                if(!data){
                    let newData = new db({ guildID: message.guild.id, userID: user.id, xp: 0, limit: client.config.LEVEL_SYSTEM.XP_LIMIT, level: level})
                    interaction.reply({ embeds: [levelSuccess]})
                  return await newData.save();
        
                }
        
        
                await db.findOneAndUpdate({ guildID: interaction.guild.id, userID: user.id}, {
                    level: level
                })
        
                interaction.reply({ embeds: [levelSuccess]})

            break;
            case "set-xp":
            
                const xpSuccess = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setTitle('Level System')
                .setDescription('XP has been set correctly!')
                .addField('User', `${user}`, true)
                .addField('New XP', `${xp}`, true)
            
                if(!data){
                    let newData = new db({ guildID: message.guild.id, userID: user.id, xp: xp, limit: client.config.LEVEL_SYSTEM.XP_LIMIT, level: 0})
                    interaction.reply({ embeds: [xpSuccess]})
                  return await newData.save();
        
                }
        
        
                await db.findOneAndUpdate({ guildID: interaction.guild.id, userID: user.id}, {
                   xp: xp, level: data.level
                })
        
                interaction.reply({ embeds: [xpSuccess]})

            break;
            case "set-xplimit":


                const xpLimitSuccess = new MessageEmbed()
                .setColor(client.config.EMBEDCOLOR)
                .setTitle('Level System')
                .setDescription('XP Limit has been set correctly!')
                .addField('User', `${user}`, true)
                .addField('New XP Limit', `${xpLimit}`, true)
            
                if(!data){
                    let newData = new db({ guildID: message.guild.id, userID: user.id, xp: xp, limit: client.config.LEVEL_SYSTEM.XP_LIMIT, level: 0})
                    interaction.reply({ embeds: [xpLimitSuccess]})
                  return await newData.save();
        
                }
        
        
                await db.findOneAndUpdate({ guildID: interaction.guild.id, userID: user.id}, {
                   xp: data.xp, level: data.level, limit: xpLimit
                })
        
                interaction.reply({ embeds: [xpLimitSuccess]})

            break;


         }
        }
    }
