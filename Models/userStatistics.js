
const mongoose = require('mongoose')

const statistics = new mongoose.Schema ({
    guildID: String,
    userID: Number,
    warnings: {type: Number, default: 0},
    bans: {type: Number, default: 0},
    kicks: {type: Number, default: 0},
    ticketsopen: {type: Number, default: 0},

})

module.exports = mongoose.model('userStassts', statistics)