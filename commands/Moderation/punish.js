const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Discord } = require('discord.js')
const db = require('../../Models/muterol')

module.exports = {
    name: "punish",
    description: "Sanction a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to moderate',
            required: true
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason for moderation',
            required: false
        }
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("punish")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason') || `No reason specified | ${interaction.user.id}`
        if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.reply({embeds: [new MessageEmbed().setDescription(`I can't moderate this user.`).setColor(`${client.config.EMBEDCOLOR}`)], ephemeral: true})
        if (member.id === interaction.guild.ownerId) return interaction.reply({embeds: [new MessageEmbed().setDescription('I cannot moderate the server owner').setColor(`${client.config.EMBEDCOLOR}`)], ephemeral: true})
        if (member.id === interaction.guild.me.id) return interaction.reply({content: 'I cannot moderate myself.', ephemeral: true})
        let embed = new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: 'Please choose an action to perform on ' + member.toString()})
        const components = (state) => [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('kick').setLabel('Kick').setStyle('SECONDARY').setEmoji('🚪').setDisabled(state),
                new MessageButton().setCustomId('ban').setLabel('Ban').setStyle('SECONDARY').setEmoji('🔨').setDisabled(state),
                new MessageButton().setCustomId('mute').setLabel('Mute').setStyle('SECONDARY').setDisabled(state).setEmoji('🎙️'),
                new MessageButton().setCustomId('unmute').setLabel('Unmute').setStyle('SECONDARY').setDisabled(state).setEmoji('📡')
            )
        ]
        await interaction.reply({embeds: [embed], components: components(false)})
        const filter = (i) => i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({filter, componentType: 'BUTTON', time: 25000})

        collector.on('collect', async (i) => {
            if (i.customId === 'kick') {

                if (!interaction.member.permissions.has('KICK_MEMBERS')) return i.reply({embeds: [new MessageEmbed().setDescription(`<:wrong:935684313465380874> You need the \`KICK_MEMBERS\` permission to use this command.`).setColor('RED')], ephemeral: true})
                await member.kick(`${reason} - Executed by: ${interaction.user.id}`)
                
                const embed1 = new MessageEmbed().setColor(`${client.config.EMBEDCOLOR}`).setDescription(`<:banmembers:935686318074241044> Successfully kicked ${member.toString()} for \`${reason}\``)
                i.update({embeds: [embed1]})
                
            } else if (i.customId === 'ban') {

                if (!interaction.member.permissions.has('BAN_MEMBERS')) return i.reply({embeds: [new MessageEmbed().setDescription(`<:wrong:935684313465380874> You need the \`BAN_MEMBERS\` permission to use this command.`).setColor('RED')], ephemeral: true})
                await member.ban(`${reason} - Executed by: ${interaction.user.id}`)

                const embed1 = new MessageEmbed().setColor(`${client.config.EMBEDCOLOR}`).setDescription(`<:ban:935685513447370802> Successfully banned ${member.toString()} for \`${reason}\``)
                i.update({embeds: [embed1]})
            } else if (i.customId === 'mute') {

                if (!interaction.member.permissions.has('MANAGE_ROLES')) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> You need the `MANAGE_ROLES` permission to use this command.'})], ephemeral: true})
                const data = await db.findOne({Guild: interaction.guildId})


                if (!data) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> I cannot mute this user because I do not have a mute role set up.'})], ephemeral: true})
                const role = interaction.guild.roles.cache.get(data.Role)
                if (!role) return


                if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> I cannot mute this user because they have a higher role than me or the same highest role as me.'})], ephemeral: true})
                if (role.position >= interaction.guild.roles.highest.position) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> I cannot mute this user because the mute role is higher than my highest role or it is my highest role.'})], ephemeral: true})
                const hasRole = member.roles.cache.has(role.id)


                if (hasRole) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> This user is already muted.'})], ephemeral: true})
                await member.roles.add(role)
                const embed2 = new MessageEmbed().setColor(`${client.config.EMBEDCOLOR}`).setDescription(`<:micmute:935684120770650202> Successfully muted ${member.toString()} for \`${reason}\``)
                i.update({embeds: [embed2]})

            } else if (i.customId === 'unmute') {

                if (!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> You need the `MANAGE_ROLES` permission to use this command.'})], ephemeral: true})
                const data = await db.findOne({Guild: interaction.guildId})
                if (!data) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> I cannot mute this user because I do not have a mute role set up.'})], ephemeral: true})
                const role = interaction.guild.roles.cache.get(data.Role)

                if (!role) return
                if (member.roles.highest.position >= interaction.guild.me.roles.highest.position) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> I cannot mute this user because they have a higher role than me or the same highest role as me.'})], ephemeral: true})
                if (role.position >= interaction.guild.roles.highest.position) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> I cannot mute this user because the mute role is higher than my highest role or it is my highest role.'})], ephemeral: true})
                const hasRole = member.roles.cache.has(role.id)
                if (!hasRole) return i.reply({embeds: [new MessageEmbed({color: `${client.config.EMBEDCOLOR}`, description: '<:wrong:935684313465380874> This user is not muted.'})], ephemeral: true})

                await member.roles.remove(role)
                const embed3 = new MessageEmbed().setColor(`${client.config.EMBEDCOLOR}`).setDescription(`<:wrong:935684313465380874> Successfully unmuted ${member.toString()} for \`${reason}\``)
                i.update({embeds: [embed3]})
            }
        })
        collector.on('end', () => {
            interaction.editReply({components: components(true)})
        })


    },
};