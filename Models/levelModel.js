const mongoose = require('mongoose');


const levelSchema = new mongoose.Schema({
    guildID: { type: String, required: true},
    userID: { type: String, required: true},
    limit: { type: Number, required: true},
    xp: { type: Number, default: 0},
    level: { type: Number, default: 0},
})

const model = mongoose.model("allLevels", levelSchema);

module.exports = model;