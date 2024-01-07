const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const client = require("../../index");
const ticketSchema = require("../../Models/ticketDB");
let supportRole = client.config.TICKET.SUPPORT_ROLE;


client.on("interactionCreate", async (interaction) => {
    const ticketSchema = require("../../Models/ticketDB");

    if(interaction.isButton()){
        
        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id
        });

        const idmiembro = interaction.channel.topic;
        const ticketaccess = client.config.TICKET.TICKET_ACCESS_ROLE;
   
    if(interaction.customId === "Ticket-Open") {
        interaction.deferUpdate();
        if(!interaction.member.roles.cache.get(ticketaccess)) {
            return;
        }
            setTimeout(() => {
                interaction.message.delete()
            }, 500);
         
         

        const openmed = new MessageEmbed()
            .setDescription(`The ticket was reopen by <@!${interaction.member.user.id}>`)
            .setColor("GREEN")
        interaction.channel.send({embeds: [openmed]})
        interaction.channel.permissionOverwrites.edit(idmiembro, { VIEW_CHANNEL: true });
        const guildData = await ticketSchema.findOne({
            guildID: interaction.guild.id,
        })
        if(!guildData) return interaction.reply({content: 'No server found', ephemeral: true})


        let channelLOG = client.config.TICKET.LOGS_CHANNEL;
        if(client.config.TICKET.LOGS_SYSTEM) {
            const log = new MessageEmbed()
            .setAuthor(`${client.config.BOTNAME} | Ticket ReOpen`)
            .setColor("YELLOW")
            .setDescription(`
            **User**: <@!${interaction.member.user.id}>
            **Action**: Re-Open a ticket
            **Ticket Name**: ${interaction.channel.name}
            **Ticket Owner**: <@!${interaction.channel.topic}>`)
        interaction.client.channels.cache.get(channelLOG).send({embeds: [log]});   
        }

    }

    if(interaction.customId === "Ticket-Review") {

        const idmiembro = await interaction.channel.topic;
        const userStaff = interaction.guild.members.cache.get(idmiembro);

        let stars = [1,2,3,4,5]
       if(client.config.TICKET.TICKET_REVIEW_ENABLED){
        const options = stars.map(x => {
            return {
                label: `${client.buttons.TICKET_REVIEW_MENU.Label}`,
                value: `${x}`,
                description: `${client.buttons.TICKET_REVIEW_MENU.Description}`.replace('<starNumber>', `${x}`),
                emoji: `${client.buttons.TICKET_REVIEW_MENU.Emoji}`,
                name: `${client.buttons.TICKET_REVIEW_MENU.Label}`,
            }
        })
    
       const starsRow = new MessageActionRow().addComponents(
           new MessageSelectMenu()
               .setCustomId("starsDropdown")
               .setMaxValues(1)
               .addOptions(options)
        )

        const starsEmbed = new MessageEmbed()
        .setColor(client.config.EMBEDCOLOR)
        .setTitle(client.embeds.Embeds.TICKET_REVIEW.Title)
        .setDescription(`${client.embeds.Embeds.TICKET_REVIEW.Description}`.replace(`<staffTag>`, `${userStaff}` ))
        .setTimestamp(client.embeds.Embeds.TICKET_REVIEW.Timestamp)
        .setFooter({text: `${client.embeds.Embeds.TICKET_REVIEW.Footer}`.replace('<botName>', client.user.username)})

        interaction.reply({ content: 'Sent!', ephemeral: true})
        interaction.channel.send({ embeds: [starsEmbed], components: [starsRow] })
       }
    }
    

    if(interaction.customId === "Ticket-Delete") {
         interaction.deferUpdate();
         const ticketSchema = require("../../Models/ticketDB");

         if(!interaction.member.roles.cache.has(supportRole)) {
            return;
        }
         
         if(!guildData) return interaction.reply({content: `No data`, ephemeral: true})

         const delembed = new MessageEmbed()
            .setDescription(`Ticket Deleted`)
            .setColor("RED")
                interaction.channel.send({embeds: [delembed]})

                setTimeout(async () => {
                  await interaction.channel.delete();
                }, 500);
               
            const db = require('../../Models/statisticsModel');
            await db.findOneAndUpdate({guildID: interaction.guild.id}, {
                $inc: {
                    ticketsOpen: -1
                },
            })
            
                if (!guildData)
                    return interaction.reply({ content: `NO data found.`, ephemeral: true });
        
                    let channelLOG = client.config.TICKET.LOGS_CHANNEL;

                const log = new MessageEmbed()
                    .setAuthor(`${client.config.BOTNAME} | Ticket Closed`)
                    .setColor("RED")
                    .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Close a ticket
                **Ticket Name**: ${interaction.channel.name}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)
                    
                if(client.config.TICKET.LOGS_SYSTEM){
                interaction.client.channels.cache.get(channelLOG).send({ embeds: [log] });
                }
    }

}

if(interaction.isSelectMenu()){

    if(interaction.customId == "starsDropdown") {

        const idmiembro = await interaction.channel.topic;
        const userStaff = interaction.guild.members.cache.get(idmiembro);

    if(!client.config.TICKET.TICKET_REVIEW_ENABLED) return;
        
    let total = client.buttons.TICKET_REVIEW_MENU.Emoji.repeat(interaction.values[0]);

    const starsEmbed = new MessageEmbed()
    .setColor(client.config.EMBEDCOLOR)
    .setTitle(client.embeds.Embeds.TICKET_REVIEWED.Title)
    .setDescription(`${client.embeds.Embeds.TICKET_REVIEWED.Description}`.replace('<stars>', `${total}`).replace('<staffTag>', `${userStaff}`))
    .setFooter({text: `${client.embeds.Embeds.TICKET_REVIEWED.Footer}`.replace('<botName>', client.user.username)})
    .setTimestamp(client.embeds.Embeds.TICKET_REVIEWED.Timestamp)

    idmiembro.send({
        embeds: [starsEmbed]
    })

    try{
    interaction.message.delete()
    } catch (error){
    }

    if(!client.config.TICKET.TICKET_REVIEW_LOGS_ENABLED) return;

    const channel = client.config.TICKET.LOGS_CHANNEL;

    const starsLog = new MessageEmbed()
    .setColor(client.config.EMBEDCOLOR)
    .setTitle(client.embeds.Embeds.TICKET_REVIEW_LOG.Title)
    .setDescription(`${client.embeds.Embeds.TICKET_REVIEW_LOG.Description}`.replace('<userMention>', `<@${interaction.user.id}>`).replace('<userID>', interaction.user.id).replace('<stars>', `${total}`).replace('<totalStars>', `(${interaction.values[0]}/5)`).replace('<staffTag>', `${userStaff}`))
    .setFooter({text: `${client.embeds.Embeds.TICKET_REVIEW_LOG.Footer}`.replace('<botName>', client.user.username)})
    .setTimestamp(client.embeds.Embeds.TICKET_REVIEW_LOG.Timestamp)

    client.channels.cache.get(channel).send({
        embeds: [starsLog]
    })

    setTimeout(() => {
        interaction.channel.delete()
    }, 5000)

}
}
});
