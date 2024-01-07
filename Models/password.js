const mongoose = require('mongoose')

const password = new mongoose.Schema ({
    guildID: String,
    password: String,
    access: Array,
})

module.exports = mongoose.model('password', password)