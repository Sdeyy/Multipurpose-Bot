const { Client, CommandInteraction, MessageEmbed, Modal, MesageEmbed, TextInputComponent, MessageActionRow, Discord, MessageButton } = require("discord.js");

module.exports = {
    name: "embed-builder",
    description: "Embed Builder Command",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("embed-builder")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

      if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

    const row = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId('etitle')
        .setLabel('Title')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('edescription')
        .setLabel('Description')
        .setStyle('PRIMARY')
     ])
    const row2 = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId('efooter')
        .setLabel('Footer')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('ecolor')
        .setLabel('Color')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('etimestamp')
        .setLabel('Timestamp')
        .setStyle('PRIMARY'),
    ])

    const row3 = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId('eremove')
        .setLabel('Remove Author')
        .setStyle('DANGER'),
        new MessageButton()
        .setCustomId('eimage')
        .setLabel('Image')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('ethumbnail')
        .setLabel('Thumbnail')
        .setStyle('PRIMARY'),
    ])

    const row4 = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId('esend')
        .setLabel('Send')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId('ecancel')
        .setLabel('Cancel')
        .setStyle('DANGER'),
    ])
    
    let embed = new MessageEmbed()
    .setAuthor(interaction.user.tag, interaction.user.avatarURL())

    const builder = await interaction.channel.send({ embeds: [embed], components: [row, row2, row3, row4] })
    
    const filter = (m) => m.author.id ===  interaction.user.id;
    const collector = builder.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 180e3 });

    interaction.reply({content: 'Creating Embed!', ephemeral: true})
    const creating = await interaction.channel.send(`Creando embed`)

    collector.on("collect", async b => {
      
        if (b?.user.id !== interaction.user.id) return b?.reply({ content: `❌ **Only the person who has written can touch it!` });

        switch (b?.customId) {
            case "ecolor": 
                const mCollector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 180e3
                })
                creating.edit('Say the color you want to put on the embed (Example: RED)')
                mCollector.on('collect', collected => {
                    if(collected.content === 'cancel'){
                        collector.stop('cancelled')
                        return b.channel.send('Embed cancelled')
                    }
                    
                    embed.setColor(collected.content)
                    creating.edit(`Set embed color to ${collected.content}`)
                    builder.edit({embeds: [embed]})
                    collected.delete()

                })


            break;
            case "etitle":
                
                const titleCollector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 180e3
                })
                creating.edit('Say the title you want to put on the embed')
                titleCollector.on('collect', collected => {
                    if(collected.content === 'cancel'){
                        collector.stop('cancelled')
                        return b.channel.send('Embed cancelled')
                    }
                  
                    embed.setTitle(collected.content)
                    creating.edit(`Set embed title to ${collected.content}`)
                    builder.edit({embeds: [embed]})
                    collected.delete();
                })

            break;
            case "edescription":
                
                const descriptionCollector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 180e3
                })
                creating.edit('Say the description you want to put on the embed')
                descriptionCollector.on('collect', collected => {
                    if(collected.content === 'cancel'){
                        collector.stop('cancelled')
                        return b.channel.send('Embed cancelled')
                    }
                  
                    embed.setDescription(collected.content)
                    creating.edit(`Set embed description to ${collected.content}`)
                    builder.edit({embeds: [embed]})
                    collected.delete();
                })

            break;
            case "efooter":
                
                const footerCollector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 180e3
                })
                creating.edit('Say the footer you want to put on the embed')
                footerCollector.on('collect', collected => {
                    if(collected.content === 'cancel'){
                        collector.stop('cancelled')
                        return b.channel.send('Embed cancelled')
                    }
                  
                    embed.setFooter(collected.content)
                    creating.edit(`Set embed footer to ${collected.content}`)
                    builder.edit({embeds: [embed]})
                    collected.delete();
                })


            break;
            case "etimestamp":
                
                const timestampCollector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 180e3
                })
                creating.edit('Do you want to put timestamp to the embed? (true/false)')
                timestampCollector.on('collect', collected => {
                    if(collected.content === 'cancel'){
                        collector.stop('cancelled')
                        return b.channel.send('Embed cancelled')
                    }

                    if(collected.content === 'true'){
                        embed.setTimestamp(true);
                        collected.delete();
                        creating.edit(`Timestamp was set`)
                        builder.edit({embeds: [embed]})
                    } else if(collected.content === 'false') {
                        embed.setTimestamp(false);
                        collected.delete();
                        creating.edit(`Timestamp not set`)
                        builder.edit({embeds: [embed]})
                    } 
                  
                })

            break;
             case "eimage":
                
                const imageCollector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 180e3
                })
                creating.edit('Send the image you want to put on the embed')
                  imageCollector.on('collect', collected => {
                    if(collected.content === 'cancel'){
                        collector.stop('cancelled')
                        return b.channel.send('embed cancelled')
                    }
                  
                    embed.setImage(collected.attachments.first()?.proxyURL || 'https://media.discordapp.net/attachments/1069833586720641064/1077458441980883015/IMG_1492.png')
                    creating.edit(`Image was set`)
                    builder.edit({embeds: [embed]})
                    collected.delete();
                })


            break;
            case "ethumbnail":
                
                const thumbnailCollector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 180e3
                })
                creating.edit('Send the image (thumbnail) you want to put on the embed')
                  thumbnailCollector.on('collect', collected => {
                    if(collected.content === 'cancel'){
                        collector.stop('cancelled')
                        return b.channel.send('embed cancelled')
                    }
                  
                    embed.setThumbnail(collected.attachments.first()?.proxyURL || null)
                    creating.edit(`Thumbnail was set`)
                    builder.edit({embeds: [embed]})
                    collected.delete();
                })


            break;
            case "esend":
                
                interaction.reply({
                    content: 'The embed was sent correctly',
                    ephemeral: true
                })
                interaction.channel.send({ embeds: [embed], components: []})

                setTimeout(() => {
                    creating.delete()
                    builder.delete()
                }, 5000)
        
            break;
            case "ecancel":
                
                interaction.reply({
                    content: 'The embed was removed successfully',
                    ephemeral: true
                })

                setTimeout(() => {
                    creating.delete()
                    builder.delete()
                }, 5000)
        
            break;
            case "eremove":
            
                embed.setAuthor(null);
                creating.edit(`The author was removed successfully`)
                builder.edit({embeds: [embed]})
        
            break;
            
        }

    })

    collector.on('end', (collected, reason) => {

        creating.delete();
        builder.edit({ content: 'The time to create the embed is over.', components: []})
    })
  
    },
};