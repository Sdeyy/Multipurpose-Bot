const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const db = require('../../Models/blacklist')
const client = require("../../index")

module.exports = {
    name: "blacklist",
    description: "add or remove blacklist a user from the tickets.",
    options: [
        {
            name: "add",
            description: "Add a user to the blacklist of the tickets",
            type: "SUB_COMMAND",
            options: [
        {
            name: 'user',
            description: 'User to add to the tickets blacklist',
            type: 'USER',
            required: true
        },

        {
            name: 'reason',
            description: 'The reason why the user will be added to the ticket blacklist.',
            type: 'STRING',
            required: false
        },
        ],
        },

        {
            name: "remove",
            description: "Remove a user from the blacklist", 
            type: "SUB_COMMAND",
            options: [
                {
            name: 'user',
            description: 'User to remove from the blacklist of the tickets',
            type: 'USER',
            required: true
        },
        
        {
            name: 'reason',
            description: 'The reason why the user will be removed from the ticket blacklist.',
            type: 'STRING',
            required: false
        },
        ],
        },
        {
            name: "check",
            description: "Check the reason of a blacklist",
            type: "SUB_COMMAND",
            options: [
        {
            name: "user",
            description: "User to check the blacklist",
            type: "USER",
            required: true
        }
        ],
        },
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     run: async (client, interaction, args) => {

        if(!interaction.member.permissions.has("MANAGE_GUILD")) return;

        const { options } = interaction;

        const Sub = options.getSubcommand(["add", "remove", "check"])

        if(Sub === "add") {

        const usuario = interaction.options.getUser('user');
        const razon = interaction.options.getString('reason') || "No reason provided";

        const isblacklisted = new MessageEmbed()
        .setColor(client.config.EMBEDCOLOR)
        .setTitle(`${client.embeds.Embeds.BLACKLIST.USERBLACKLISTED.Title}`)
        .setDescription(`${client.embeds.Embeds.BLACKLIST.USERBLACKLISTED.Description}`.replace("<user>", `${usuario}`))

        const checking = await db.findOne({ guildID: interaction.guild.id, userID: usuario.id });
        if (checking) return interaction.reply({embeds: [isblacklisted], 
            ephemeral: client.embeds.Embeds.BLACKLIST.USERBLACKLISTED.Ephemeral});

        const blacklistdb = new db({
            guildID: interaction.guild.id,
            userID: usuario.id,
            reason: razon
        });

        await blacklistdb.save();

        const blacklisted = new MessageEmbed()
        .setColor(client.config.EMBEDCOLOR)
        .setTitle(client.embeds.Embeds.BLACKLIST.BLACKLISTED.Title)
        .setDescription(`${client.embeds.Embeds.BLACKLIST.BLACKLISTED.Description}`.replace("<user>", `${usuario}`).replace("<reason>", `${razon}`))
        interaction.reply({
            embeds: [blacklisted],
            ephemeral: client.embeds.Embeds.BLACKLIST.BLACKLISTED.Ephemeral
        })

            } else if (Sub === "remove") {

        const usuario = interaction.options.getUser('user');
        const razon = interaction.options.getString('reason') || "No reason provided";

        const data = await db.findOne({guildID: interaction.guild.id})

        const alreadyUnblacklisted = new MessageEmbed()
        .setColor(client.config.EMBEDCOLOR)
        .setTitle(`${client.embeds.Embeds.UNBLACKLIST.USERUNBLACKLISTED.Title}`)
        .setDescription(`${client.embeds.Embeds.UNBLACKLIST.USERUNBLACKLISTED.Description}`.replace("<user>", `${usuario}`))

        const checking = await db.findOne({ guildID: interaction.guild.id, userID: usuario.id });
        if (!checking) return interaction.reply({embeds: [alreadyUnblacklisted],
            ephemeral: client.embeds.Embeds.UNBLACKLIST.USERUNBLACKLISTED.Ephemeral});
  
        await db.findOneAndDelete({ guildID: interaction.guild.id, userID: usuario.id });

        const unblacklisted = new MessageEmbed()
        .setColor(client.config.EMBEDCOLOR)
        .setTitle(`${client.embeds.Embeds.UNBLACKLIST.UNBLACKLISTED.Title}`)
        .setDescription(`${client.embeds.Embeds.UNBLACKLIST.UNBLACKLISTED.Description}`.replace("<user>", `${usuario}`).replace("<reason>", `${razon}`))

        interaction.reply({
            embeds: [unblacklisted]
        })

        } else if (Sub === "check") {

        const usuario = interaction.options.getUser("user");

        const data = await db.findOne({ guildID: interaction.guild.id, userID: usuario.id })

        const noblacklisted = new MessageEmbed()
        .setColor(client.config.EMBEDCOLOR)
        .setTitle(`${client.embeds.Embeds.CHECKBLACKLIST.NOBLACKLISTED.Title}`)
        .setDescription(`${client.embeds.Embeds.CHECKBLACKLIST.NOBLACKLISTED.Description}`.replace("<user>", `${usuario}`))

        if(!data) return interaction.reply({embeds: [noblacklisted], ephemeral: client.embeds.Embeds.CHECKBLACKLIST.BLACKLISTED.Ephemeral})

        const blacklisted = new MessageEmbed()
        .setColor(client.config.EMBEDCOLOR)
        .setTitle(client.embeds.Embeds.CHECKBLACKLIST.BLACKLISTED.Title)
        .setDescription(`${client.embeds.Embeds.CHECKBLACKLIST.BLACKLISTED.Description}`.replace("<user>", `${usuario}`).replace("<reason>",`${data.reason}` ))
        interaction.reply({embeds: [blacklisted], ephemeral: client.embeds.Embeds.CHECKBLACKLIST.BLACKLISTED.Ephemeral})


        }
    }
}