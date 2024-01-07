const { Discord, MessageEmbed } = require('discord.js');
const client = require('../../index');

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    
    if(!client.config.ROLE_NICKNAME.ENABLED) return;

    if(oldMember.roles.cache.size > newMember.roles.cache.size){

        oldMember.roles.cache.forEach( role => {
            if(!newMember.roles.cache.has(role.id)){
                newMember.setNickname(null)
            }
        })

    } else if(oldMember.roles.cache.size < newMember.roles.cache.size){

        newMember.roles.cache.forEach(role => {
            if(!oldMember.roles.cache.has(role.id)){

                newMember.setNickname(`${client.config.ROLE_NICKNAME.PREFIX}`.replace(`<roleName>`, `${role.name}`).replace(`<userName>`, `${newMember.user.username}`))
            }
        })

    }
})