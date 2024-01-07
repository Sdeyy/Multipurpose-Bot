const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('settings/config.yml', 'utf8', 2))
const chalk = require('chalk');
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    client.on("ready", () => {
    
        console.log(chalk.magenta.bold(' ╔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╗'));
        console.log(chalk.magenta.bold(` ┃  Raven Bot by Raven Solutions & ByCoquito  ┃`));
        console.log(chalk.magenta.bold(` ┃          discord.gg/ravensolutions         ┃`));
        console.log(chalk.magenta.bold(` ╚━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╝`));

    })

    const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    default: {
        botsCanWin: `${config.GIVEAWAYS.BOTS_CAN_WIN}`,
        embedColor: `${config.GIVEAWAYS.EMBED_COLOR}`,
        embedColorEnd: `${config.GIVEAWAYS.EMBED_COLOR_END}`,
        reaction: `${config.GIVEAWAYS.REACTION}`,
        lastChance: {
            enabled: `${config.GIVEAWAYS.LAST_CHANCE}`,
            content: '⚠️ **Last chance to join** ⚠️',
            threshold: 5000,
            embedColor: `${config.GIVEAWAYS.LAST_CHANCE_COLOR}`
        }
    }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageId} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageId} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});


    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/prefixCommands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands

    const slashCommands = await globPromise(
        `${process.cwd()}/commands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });


    client.on("ready", async () => {
        try { 
        await client.guilds.cache
            .get(`${config.GUILDID}`) 
            .commands.set(arrayOfSlashCommands);
        } catch (error) {
            console.log(chalk.red.bold(` [ERROR] `) + chalk.underline.white(`Incorrect GuildID, check that it has been correctly placed in the configuration file.`))
        }
    });
};

