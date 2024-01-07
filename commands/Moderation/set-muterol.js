const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const db = require('../../Models/muterol')
const Client = require('../../index');

module.exports = {
    name: 'set-muterole',
    description: 'Set the role for mutes.',
    options: [
        {
            name: 'role',
            description: 'The role to set as the mute role.',
            type: 'ROLE',
            required: true
        }
    ],
    permis: 'MANAGE_ROLES',
    botPerms: 'MANAGE_ROLES',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {string[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("set-muterol")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});

        
        const role = interaction.options.getRole('role')
        const data = await db.findOne({Guild: interaction.guild.id})
        if (!data) {
            await db.create({
                Guild: interaction.guild.id,
                Role: role.id
            })
            return interaction.reply({content: `Set the mute role to ${role.toString()}`})
        } else {
            await db.findOneAndUpdate({Guild: interaction.guild.id}, {Role: role.id})
            return interaction.reply({content: `Changed the mute role to ${role.toString()}`})
        }
    }
}
