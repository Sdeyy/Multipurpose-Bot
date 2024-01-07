const Discord = require('discord.js')
const client = require('../../index.js')
const moment = require('moment');
client.on('guildMemberAdd', async (member) => {

     if(client.config.ANTI_RAID.ANTI_JOIN_BOTS){
        if(member.user.bot) {
          member.kick();
        }
     }
    moment.locale('es');
    function formatDate (template, date) {
        var specs = 'YYYY:MM:DD:HH:mm:ss'.split(':')
        date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4)
        return date.toISOString().split(/[-:.TZ]/).reduce(function (template, item, i) {
          return template.split(specs[i]).join(item)
        }, template)
      }

      const tituloembed = client.config.WELCOME_SYSTEM.MESSAGE_EMBED.TITLE.replace('{user-tag}', member.user.tag).replace('{user-mention}', member.user).replace('{member-count}', member.guild.memberCount).replace('{server-name}', member.guild.name).replace('{member-id}', member.id);
      const descembed = client.config.WELCOME_SYSTEM.MESSAGE_EMBED.DESCRIPTION.replace('{user-tag}', member.user.tag).replace('{user-mention}', member.user).replace('{member-count}', member.guild.memberCount).replace('{server-name}', member.guild.name).replace('{member-id}', member.user.id);
      const footerembed = client.config.WELCOME_SYSTEM.MESSAGE_EMBED.FOOTER.replace('{user-tag}', member.user.tag).replace('{user-mention}', member.user).replace('{member-count}', member.guild.memberCount).replace('{server-name}', member.guild.name).replace('{member-id}', member.user.id);

    const embedwelcome = new Discord.MessageEmbed()
    .setColor(`${client.config.EMBEDCOLOR}`)
    .setTitle(tituloembed)
    .setDescription(descembed)
    .setFooter(footerembed, member.guild.iconURL({dynamic: true}))

   if(client.config.WELCOME_SYSTEM.ENABLED) {

    const logs = member.guild.channels.cache.get(client.config.WELCOME_SYSTEM.CHANNEL)
    logs.send({ embeds: [embedwelcome]})
    }

    if(client.config.JOIN_ROLES.ENABLED) {
      let roles = client.config.JOIN_ROLES.ROLES

      member.roles.add(roles)
    }

   })


   