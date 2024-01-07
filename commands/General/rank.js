const { Client, CommandInteraction, MessageEmbed, Discord, MessageAttachment } = require("discord.js");
const db = require('../../Models/levelModel');
const { Rank } = require('canvacord');

module.exports = {
    name: "rank",
    description: "Check user rank.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user.',
            type: 'USER',
            required: false
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if(client.config.DISABLE_COMMANDS.DISABLED.includes("rank")) return interaction.reply({ 
            content: `${client.messages.DISABLED_COMMAND}`, 
            ephemeral: true
        })

        if(!client.config.LEVEL_SYSTEM.ENABLED) return interaction.reply({ content: 'Level System disabled!', ephemeral: true})

        const user = interaction.options.getMember('user') || interaction.member;

        const data = await db.findOne({ guildID: interaction.guild.id, userID: user.id });

        if(!data) return interaction.reply({
            content: 'User dont have data',
            ephemeral: true
        })

        let allData = await db.find({ guildID: interaction.guild.id }).sort([["xp", "descending"]]).exec();
        if(!allData) return interaction.reply({ content: 'No data', ephemeral: true});


        const rankCard = new Rank()
        .setAvatar(user.displayAvatarURL({ size: 2048, format: "png" }))
        .setCurrentXP(data.xp)
        .setRequiredXP(data.limit)
        .setLevel(data.level)
        .setProgressBar("#FFFFFF", "COLOR")
        .setUsername(user.user.username)
        .setDiscriminator(user.user.discriminator)
        .setRank(allData.findIndex(dataUser => dataUser.userID == user.id ) +1);

        const buffer = await rankCard.build();

        const attachment = new MessageAttachment(buffer, "rank.png");

        interaction.reply({ files: [attachment] })
        

    },
};