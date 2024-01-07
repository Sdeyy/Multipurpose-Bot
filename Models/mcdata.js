const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    Guild: String,
    Ip: String,
    Store: String,
    Teamspeak: String,
    Status: String
})

module.exports = mongoose.model('minecraftData', Schema, 'minecraftData')

