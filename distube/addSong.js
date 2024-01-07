const Discord = require('discord.js');
const client = require('../index.js');

module.exports = (client, queue, song) => {
  const embed = new Discord.MessageEmbed()
  .setColor('GREEN')
  .setDescription(`${client.messages.MUSIC.PLAYING_NOW}`.replace('<songName>', `${song.name}`))

  queue.textChannel.send({ embeds: [embed]})
}