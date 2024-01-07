const { MessageEmbed } = require("discord.js");
const client = require("../../index");

client.on("interactionCreate", async (interaction) => {
    if(interaction.isSelectMenu()) {
        if(interaction.customId !== "autoroles") return;
        if(client.config.REACTION_ROLES.ENABLED == false) return;
        const roleId = interaction.values[0];
        const role = interaction.guild.roles.cache.get(roleId);
        const hasRole = interaction.member.roles.cache.has(roleId);
        await interaction.deferUpdate();
        if(hasRole) {
          const desc = `${client.messages.REACTION_ROLES.REMOVED_DESCRIPTION}`.replace("<role>", role);
                 const embed = new MessageEmbed()
                .setTitle(client.messages.REACTION_ROLES.REMOVED_TITLE)
                .setColor(client.config.EMBEDCOLOR)
                .setTimestamp()
                .setDescription(desc);
            interaction.followUp({embeds: [embed], ephemeral: true});
            interaction.member.roles.remove(roleId);
        } else {
            const desc = `${client.messages.REACTION_ROLES.ADDED_DESCRIPTION}`.replace("<role>", role);
            const embed = new MessageEmbed()
                .setTitle(client.messages.REACTION_ROLES.ADDED_TITLE)
                .setColor(client.config.EMBEDCOLOR)
                .setTimestamp()
                .setDescription(desc);
            interaction.followUp({embeds: [embed], ephemeral: true});
            interaction.member.roles.add(roleId);
        }
    };
})