const client = require("../../index.js");
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const schema = require("../../Models/blacklistWords");

client.on("messageCreate", async (message) => {

    
    const whitelistRoles = client.config.BLACKLIST_WORDS.WHITELIST_ROLES;
    
    if(message.author.bot){
        return;
    }
    if (message.webhookId) return;

    if (message.member.roles.cache.some(role => whitelistRoles.includes(role.id))) {
        return}else if(message.member.permissions.has('ADMINISTRATOR')){
            return
        }

        const embed = new MessageEmbed()
        .setColor(client.embeds.Embeds.BLACKLIST_WORDS.Color)
        .setTitle(`${client.embeds.Embeds.BLACKLIST_WORDS.Title}`)
        .setDescription(`${client.embeds.Embeds.BLACKLIST_WORDS.Description}`.replace('<userTag>', `<@${message.member.id}>`))
    
        let data;
        try{
            data = await schema.findOne({ guildId: message.guild.id })
            if(!data) {
                data = await schema.create({ guildId: message.guild.id})
            }
        } catch (error) {
            console.log(error)
        }


    if(data.BLW.some(word => message.content.toLowerCase().includes(word))) {
        message.delete()
        message.channel.send({ embeds: [embed]})
    }


});

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(oldMessage.author.bot){
        return;
    }
    if (oldMessage.webhookId) return;

    const embed = new MessageEmbed()
    .setColor(client.embeds.Embeds.BLACKLIST_WORDS.Color)
    .setTitle(`${client.embeds.Embeds.BLACKLIST_WORDS.Title}`)
    .setDescription(`${client.embeds.Embeds.BLACKLIST_WORDS.Description}`.replace('<userTag>', `<@${oldMessage.member.user.id}>`))


    let data;
    try{
        data = await schema.findOne({ guildId: oldMessage.guild.id })
        if(!data) {
            data = await schema.create({ guildId: oldMessage.guild.id})
        }
    } catch (error) {
        console.log(error)
    }

    if(data.BLW.some(word => newMessage.content.toLowerCase().includes(word))) {
        newMessage.delete()
        newMessage.channel.send({ embeds: [embed]})
    }
});