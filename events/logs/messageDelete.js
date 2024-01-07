const { MessageEmbed } = require('discord.js');
const client = require("../../index");


client.on("messageDelete", async (message) => {
    if(message.author.bot) return;
    client.snipes = new Map();
    let snipes = client.snipes.get(message.channel.id) || [];
    if (snipes.length > 5) snipes = snipes.slice(0, 4);

    snipes.unshift({
      msg: message,
      image: message.attachments.first()?.proxyURL || null,
    });
    client.snipes.set(message.channel.id, snipes);
    if(!client.config.LOGS_SYSTEM.LOG_ENABLED) return;

    const logs = message.guild.channels.cache.get(client.config.LOGS_SYSTEM.LOGS_CHANNEL)
    if(client.config.LOGS_SYSTEM.ENABLED.includes("MessageDeleted")) {
        const embed = new MessageEmbed()
            .setTitle("Message Deleted")
            .setDescription(`Author: <@${message.author.id} | ||${message.author.id}||
            Channel: <#${message.channel.id}> | ${message.channel.id}
            Message: ${message.content}`)
            .setImage(message.attachments.first()?.proxyURL || null)
            .setColor("RED")
            .setTimestamp();
        try {
            await logs.send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    };
});


   