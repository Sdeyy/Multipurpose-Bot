const {Discord, MessageEmbed} = require('discord.js');
const client = require('../../index');

client.on("messageCreate", async message => {

    if(!client.config.LEVEL_SYSTEM.ENABLED) return;

    if(message.author.bot) return;

    const db = require("../../Models/levelModel");

    const data = await db.findOne({ guildID: message.guild.id, userID: message.author.id });
    const xp = Math.floor(Math.random() * client.config.LEVEL_SYSTEM.XP_ADD) + 1;

    if(!data){
        let newData = new db({ guildID: message.guild.id, userID: message.author.id, xp: xp, limit: client.config.LEVEL_SYSTEM.XP_LIMIT})
      return await newData.save();
    }

    await db.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id}, { xp: data.xp + xp})

    if(data.xp > data.limit) {
        await db.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id}, {level: data.level + 1, limit: data.limit + client.config.LEVEL_SYSTEM.XP_LIMIT })
        await message.channel.send(`${client.messages.LEVEL_SYSTEM.NEW_LEVEL}`.replace("<userTag>", `${message.author}`).replace("<level>", `${data.level + 1}`).replace("<xp>", `${data.xp}`))
    }

})