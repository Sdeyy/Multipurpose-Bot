const sugSchema = require('../../Models/votos-sugs')
const Discord = require('discord.js')
const client = require("../../index.js");
  
    client.on("interactionCreate", async interaction => {
        try {

 
            let msg_data = await sugSchema.findOne({ messageID: interaction.message.id });
         
            switch (interaction.customId) {
                case "votar_si": {
                    if(msg_data.si.includes(interaction.user.id)) return interaction.reply({content:`${client.messages.SUGGESTION.ALREADY_VOTED_YES}`.replace('<suggester>', `<@${msg_data.autor}>`), ephemeral: true})
                    if(msg_data.no.indexOf(interaction.user.id) >= 0) msg_data.no.splice(msg_data.no.indexOf(interaction.user.id), 1)
                    msg_data.si.push(interaction.user.id)
                    msg_data.save();


                    interaction.message.components[0].components[0].label = msg_data.si.length.toString();
                    interaction.message.components[0].components[1].label = msg_data.no.length.toString();

              
                    await interaction.message.edit({ components: [interaction.message.components[0]] })
                    interaction.deferUpdate();
                }
                    break;

                case "votar_no": {
         
                    if(msg_data.no.includes(interaction.user.id)) return interaction.reply({content:`${client.messages.SUGGESTION.ALREADY_VOTED_NO}`.replace('<suggester>', `<@${msg_data.autor}>`), ephemeral: true})
                    
                    if(msg_data.si.indexOf(interaction.user.id) >= 0) msg_data.si.splice(msg_data.si.indexOf(interaction.user.id), 1)
                    msg_data.no.push(interaction.user.id)
                    msg_data.save();
                
                    interaction.message.components[0].components[0].label = msg_data.si.length.toString()
                    interaction.message.components[0].components[1].label = msg_data.no.length.toString()

                 
                    await interaction.message.edit({ components: [interaction.message.components[0]] })
                    interaction.deferUpdate();
                }
                    break;

                case "ver_votos": {
                    interaction.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`${client.embeds.Embeds.SUGGESTION_SYSTEM.VIEW_VOTES.Title}`)
                            .addField(`${client.embeds.Embeds.SUGGESTION_SYSTEM.VIEW_VOTES.upVotes}`, msg_data.si.length >= 1 ? msg_data.si.map(u => `<@${u}>`).toString() : `${client.embeds.Embeds.SUGGESTION_SYSTEM.VIEW_VOTES.noVotes}`)
                            .addField(`${client.embeds.Embeds.SUGGESTION_SYSTEM.VIEW_VOTES.downVotes}`, msg_data.no.length >= 1 ? msg_data.no.map(u => `<@${u}>`).toString() : `${client.embeds.Embeds.SUGGESTION_SYSTEM.VIEW_VOTES.noVotes}`)
                            .setColor(client.config.EMBEDCOLOR)
                        ], ephemeral: true
                    })
                }
                    break;

                default:
                    break;
            }
        } catch (e) { }
    })
