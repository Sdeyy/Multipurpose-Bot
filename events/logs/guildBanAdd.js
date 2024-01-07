const { Discord, MessageEmbed } = require('discord.js');
const db = require('../../Models/userStatistics');
const client = require('../../index');

client.on("guildBanAdd", async ban => {
    const statsData = await db.findOne({ guildID: ban.guild.id, userID: ban.user.id })

    if(!statsData){
     await db.create({ guildID: ban.guild.id, userID: ban.user.id})
    }

    await db.findOneAndUpdate({guildID: ban.guild.id, userID: ban.user.id}, {
        $inc: {
            bans: 1
        },
    })



    if(!client.config.LOGS_SYSTEM.LOG_ENABLED) return;
    if(client.config.LOGS_SYSTEM.ENABLED.includes("guildBanAdd")) {
        const logs = ban.guild.channels.cache.get(client.config.LOGS_SYSTEM.LOGS_CHANNEL);

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_ADD"
        })

        const banLog = fetchedLogs.entries.first();

        if(!banLog) return console.log(`${ban.user.tag} was banned but no audit log could be found.`)

        const { executor, target, reason } = banLog;
        const rBan = reason || "No reason";
        if(target.id === ban.user.id){  
            const embed = new MessageEmbed()
            .setTitle("🔨 User Banned")
            .setDescription(`User: <@${ban.user.id}>
            User ID: ${ban.user.id}
            Executor: ${executor.tag}
            Reason: ${rBan}`)
            .setColor("ORANGE")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
        }

    }

})