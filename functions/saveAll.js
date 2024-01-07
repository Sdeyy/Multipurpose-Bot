const ecoSchema = require('../Models/economy')
const Discord = require('discord.js')

module.exports = {
    saveAll
}

async function saveAll(guildid, userid) {
    if (userid) {
        let ecodata = await ecoSchema.findOne({ userID: userid })
        if (!ecodata) {
            console.log(`[Saved] Economy of ${userid}`.green);
            ecodata = await new ecoSchema({
                userID: userid
            });
            await ecodata.save();
        }
    }
}