const ecoSchema = require('../Models/economy')
const Discord = require('discord.js')

module.exports = {
    pagination
}


async function pagination(client, interaction, texto, titulo = "Paginación", elementos_por_pagina = 5) {

    var embeds = [];
    var dividido = elementos_por_pagina;
    for(let i = 0; i < texto.length; i+= dividido) {
        let desc = texto.slice(i, elementos_por_pagina);
        elementos_por_pagina+= dividido;
      
        let embed = new Discord.MessageEmbed()
        .setTitle(titulo.toString())
        .setDescription(desc.join(" "))
        .setColor(client.color)
        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
        embeds.push(embed)
    }

    let paginaActual = 0;
  
    if (embeds.length === 1) return interaction.channel.send({ embeds: [embeds[0]] }).catch(() => { });
  
    let button_back = new Discord.MessageButton().setStyle(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_PREVIOUS.Style}`).setCustomId('Atrás').setEmoji(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_PREVIOUS.Emoji}`).setLabel(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_PREVIOUS.Label}`)
    let button_home = new Discord.MessageButton().setStyle(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_MAIN.Style}`).setCustomId('Inicio').setEmoji(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_MAIN.Emoji}`).setLabel(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_MAIN.Label}`)
    let button_next = new Discord.MessageButton().setStyle(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_NEXT.Style}`).setCustomId('Avanzar').setEmoji(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_NEXT.Emoji}`).setLabel(`${client.buttons.ECONOMY_LEADERBOAD.BUTTON_NEXT.Label}`)
  
    let embedpaginas = await interaction.channel.send({
        content: `**Click on the __buttons__ to change the page.**`,
        embeds: [embeds[0].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
        components: [new Discord.MessageActionRow().addComponents([button_back, button_home, button_next])]
    });
  
    const collector = embedpaginas.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 180e3 });
  
    collector.on("collect", async b => {
      
        if (b?.user.id !== interaction.user.id) return b?.reply({ content: `❌ **Only the person who has written \`${prefix}queue\` can change pag!` });

        switch (b?.customId) {
            case "Atrás": {
              
                collector.resetTimer();
              
                if (paginaActual !== 0) {
                  
                    paginaActual -= 1
                  
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                } else {
                  
                    paginaActual = embeds.length - 1
                  
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            case "Inicio": {
              
                collector.resetTimer();
              
                paginaActual = 0;
                await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                await b?.deferUpdate();
            }
                break;

            case "Avanzar": {
              
                collector.resetTimer();
              
                if (paginaActual < embeds.length - 1) {
                  
                    paginaActual++
                  
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                  
                } else {
                  
                    paginaActual = 0
                  
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            default:
                break;
        }
    });
    collector.on("end", () => {
      
        embedpaginas.components[0].components.map(button=> button.disabled = true)
        embedpaginas.edit({ content: `Time has expired!`, embeds: [embeds[paginaActual].setFooter({ text: `Page ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
    });
}