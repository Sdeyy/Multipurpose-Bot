async function getNumber(ticketCounter, ticketDB, guildID) {
    if(ticketCounter = 0) {
        await ticketDB.findOneAndUpdate({guildID: guildID}, {$set: {ticketCounter: 1}})
    } else {
        await ticketDB.findOneAndUpdate({guildID: guildID}, {$inc: {ticketCounter: 1}})
        let dataNum = await ticketDB.findOne({guildID: guildID})
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        var getNumber = zeroPad(dataNum.ticketCounter, 4);
    }
    return getNumber;
}
module.exports = getNumber;