const client = require('../../index.js')
const {AntiRaidManager} = require('discord-antiraid');
const chalk = require('chalk')
client.on("ready", () => {

    if(client.config.ANTI_RAID.ENABLED) {
        
        console.log(chalk.green.bold(' ╔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╗'));
        console.log(chalk.green.bold(` ┃       Anti-Raid is enabled     ┃`))
        console.log(chalk.green.bold(` ╚━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╝`))
      new AntiRaidManager(client, {
        enabled: client.config.ANTI_RAID.ENABLED,
        events: client.config.ANTI_RAID.SETTINGS,
        exemptedRoles: client.config.ANTI_RAID.BYPASS_ROLES, 
        exemptedUsers: client.config.ANTI_RAID.BYPASS_USERS, 
        rateLimit: client.config.ANTI_RAID.MAX_ACTIONS, 
        time: client.config.ANTI_RAID.TIME, 
        sanction: client.config.ANTI_RAID.SANCTION, 
        reason: client.config.ANTI_RAID.REASON
        
    })


} else {
    console.log(chalk.red.bold(' ╔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╗'));
    console.log(chalk.red.bold(` ┃      Anti-Raid is disabled     ┃`))
    console.log(chalk.red.bold(` ╚━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╝`))
}
})