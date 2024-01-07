const { MessageEmbed } = require('discord.js');
const client = require("../../index");

client.on("channelDelete", async (channel) => {

    if(!client.config.LOGS_SYSTEM.LOG_ENABLED) return;
    if(client.config.LOGS_SYSTEM.ENABLED.includes("channelDelete")) {
        const logs = channel.guild.channels.cache.get(client.config.LOGS_SYSTEM.LOGS_CHANNEL);
        if(channel.type === "GUILD_CATEGORY") {
        const embed = new MessageEmbed()
            .setTitle("Channel Deleted")
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Category`)
            .setColor("RED")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_TEXT") {
        const embed = new MessageEmbed()
            .setTitle("Channel Deleted")
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Text`)
            .setColor("RED")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_VOICE") {
        const embed = new MessageEmbed()
            .setTitle("Channel Deleted")
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Voice`)
            .setColor("RED")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_NEWS") {
        const embed = new MessageEmbed()
            .setTitle("Channel Deleted")
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `News`)
            .setColor("RED")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_STAGE_VOICE") {
        const embed = new MessageEmbed()
            .setTitle("Channel Deleted")
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Stage Voice`)
            .setColor("RED")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
}})