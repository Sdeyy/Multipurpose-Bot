const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "role",
    description: "Manage Roles of a Member.",
    type: 'CHAT_INPUT',
    options: [{
        name: 'add',
        type: 'SUB_COMMAND',
        description: 'Add a role to a user.',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user to add a role.',
            required: true,
        },
        {
            name: 'role',
            type: 'ROLE',
            description: 'Role to add to a user.',
            required: true,
        }]
    },
    {
        name: "list",
        type: 'SUB_COMMAND',
        description: "List Roles",
    },
    {
        name: 'remove',
        type: 'SUB_COMMAND',
        description: 'Remove a role to a user.',
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user to remove a role.',
            required: true,
        },
        {
            name: 'role',
            type: 'ROLE',
            description: 'Role to remove to a user.',
            required: true,
        }]
    },
],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("roles")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })
        
        if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({content: `${client.messages.NO_PERMSBOT}`, ephemeral: true})
        if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({content: `${client.messages.NO_PERMSUSER}`, ephemeral: true});
                const [SubCommand] = args;
                if(SubCommand == "add") {
                    const role = interaction.options.getRole('role');
                    if(role.position >= interaction.guild.me.roles.highest) {
                        return interaction.reply({content: `${client.messages.NO_PERMSROLEHIGHER}`, ephemeral: true});}
                    const usuario = interaction.options.getMember("user")
                    if(usuario.roles.cache.get(role.id)) return interaction.reply({content: `${client.messages.ROLES.ALREADY}`.replace('<user>', usuario).replace('<role>', role), ephemeral: true})
                    usuario.roles.add(role.id);
                const embed = new MessageEmbed()
                    .setTitle(`${client.messages.ROLES.SUCCESS.ADDED.TITLE}`)
                    .setDescription(`${client.messages.ROLES.SUCCESS.ADDED.DESCRIPTION}.`.replace('<role>', role).replace('<user>', usuario))
                    .setColor(`${client.config.EMBEDCOLOR}`)
                    .setTimestamp();
                interaction.reply({embeds: [embed], ephemeral: true});
        } else if(SubCommand == "remove") {
            const role = interaction.options.getRole('role');
            if(role.position >= interaction.guild.me.roles.highest) {
                return interaction.reply({content: `${client.messages.NO_PERMSROLEHIGHER}`, ephemeral: true});}
                    const usuario = interaction.options.getMember("user")
                    if(!usuario.roles.cache.get(role.id)) return interaction.reply({ content: `${client.messages.ROLES.NO_HAVE_ROLE}`.replace('<user>', usuario).replace('<role>', role), ephemeral: true});
                    if(usuario.roles.cache.get(role.id))
                    usuario.roles.remove(role.id);
                const embed2 = new MessageEmbed()
                 .setTitle(`${client.messages.ROLES.SUCCESS.REMOVED.TITLE}`)
                 .setDescription(`${client.messages.ROLES.SUCCESS.REMOVED.DESCRIPTION}`.replace('<role>', role).replace('<user>', usuario))
                 .setColor(`${client.config.EMBEDCOLOR}`)
                 .setTimestamp();
                interaction.reply({embeds: [embed2], ephemeral: true});
        } else if(SubCommand == "list") {
            const guild = interaction.guild;
            const roles = guild.roles.cache;
            let query;
            if (query) {
                roles = roles.filter(r => r.name.toLowerCase().search(query) > -1);}
            const embed3 = new MessageEmbed()
             .setColor(`${client.config.EMBEDCOLOR}`)
             .setDescription(
                roles.map(query => `<@&${query.id}>`)
                .join('\n'))
             .setFooter(`${guild.name} roles list`, guild.iconURL());
             interaction.reply({embeds: [embed3], ephemeral: false});
        }
    }
};
