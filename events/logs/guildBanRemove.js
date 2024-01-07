const { Discord, MessageEmbed } = require('discord.js');
const client = require('../../index');

client.on("guildBanRemove", async ban => {


    if(!client.config.LOGS_SYSTEM.LOG_ENABLED) return;
    if(client.config.LOGS_SYSTEM.ENABLED.includes("guildBanRemove")) {
        const logs = ban.guild.channels.cache.get(client.config.LOGS_SYSTEM.LOGS_CHANNEL);

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_BAN_REMOVE"
        })

        const banLog = fetchedLogs.entries.first();

        if(!banLog) return console.log(`${ban.user.tag} was banned but no audit log could be found.`)

        const { executor, target } = banLog;
        if(target.id === ban.user.id){  
            const embed = new MessageEmbed()
            .setTitle("User Ban Removed")
            .setDescription(`User: <@${ban.user.id}>
            User ID: ${ban.user.id}
            Executor: ${executor.tag}`)
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