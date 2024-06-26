
const mongoose = require('mongoose')

const statistics = new mongoose.Schema ({
    guildID: String,
    ticketsOpen: {type: Number, default: 0},
    ticketsClaimed: {type: Number, default: 0},
    totalSuggestions: {type: Number, default: 0},
    totalAccepted: {type: Number, default: 0},
    totalDenied: {type: Number, default: 0},
    totalPending: {type: Number, default: 0},

})

module.exports = mongoose.model('statss', statistics)