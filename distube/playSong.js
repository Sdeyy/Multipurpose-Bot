const Discord = require('discord.js')

module.exports = (client, queue, song) => {
  const embed = new Discord.MessageEmbed()
  .setColor('GREEN')
  .setDescription(`${client.messages.MUSIC.SONG_ADDED}`.replace('<songName>', `${song.name}`))

  queue.textChannel.send({ embeds: [embed]})
}