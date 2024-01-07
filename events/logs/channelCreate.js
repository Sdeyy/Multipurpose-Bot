const { MessageEmbed } = require('discord.js');
const client = require("../../index");

client.on("channelCreate", async (channel) => {

    if(!client.config.LOGS_SYSTEM.LOG_ENABLED) return;
    if(client.config.LOGS_SYSTEM.ENABLED.includes("channelCreate")) {
        const logs = channel.guild.channels.cache.get(client.config.LOGS_SYSTEM.LOGS_CHANNEL);
        if(channel.type === "GUILD_CATEGORY") {
        const embed = new MessageEmbed()
            .setTitle("Channel Created")
            .addField("Channel:", `${channel}`)
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Category`)
            .setColor("GREEN")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_TEXT") {
        const embed = new MessageEmbed()
            .setTitle("Channel Created")
            .addField("Channel:", `${channel}`)
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Text`)
            .setColor("GREEN")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_VOICE") {
        const embed = new MessageEmbed()
            .setTitle("Channel Created")
            .addField("Channel:", `${channel}`)
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Voice`)
            .setColor("GREEN")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_NEWS") {
        const embed = new MessageEmbed()
            .setTitle("Channel Created")
            .addField("Channel:", `${channel}`)
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `News`)
            .setColor("GREEN")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
    if(channel.type === "GUILD_STAGE_VOICE") {
        const embed = new MessageEmbed()
            .setTitle("Channel Created")
            .addField("Channel:", `${channel}`)
            .addField("Channel Name:", `${channel.name}`)
            .addField("Channel Type:", `Stage Voice`)
            .setColor("GREEN")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
}})