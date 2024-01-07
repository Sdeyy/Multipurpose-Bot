const Discord = require("discord.js");
const client = require("../../index.js");

let roomsChannel = client.config.AUTO_VC.CHANNEL_ID;
let roomsCategory = client.config.AUTO_VC.CATEGORY_ID;

if(!client.config.AUTO_VC.ENABLED) return; 

client.on("voiceStateUpdate", async(oldState, newState) => {

    if(!newState.guild.channels.cache.get(roomsChannel)) return;
    if(!newState.guild.channels.cache.get(roomsCategory)) return;

    try{
    if(newState.channelId == roomsChannel){
       newState.guild.channels.create(`${client.config.AUTO_VC.CHANNEL_NAME}`.replace('<userName>', `${newState.member.user.username}`), {
            type: "GUILD_VOICE",
            parent: roomsCategory,
        }).then(channel => {
            oldState.member.voice.setChannel(channel);
        })
    } 
        }catch(error){}
})

client.on("voiceStateUpdate", async(oldState, newState) => {

    try{
    if(oldState.channel.parentId == roomsCategory) {
        if(oldState.channelId == roomsChannel) return;
         await oldState.channel.delete();
    }
} catch(error) {}
})