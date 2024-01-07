const mongoose = require('mongoose')

const schema = new mongoose.Schema ({
    guildID: String,
    applicationID: String,
    applicationName: String,
    applicationDescription: String,
    ApplicationQuestions:{type: Array, default: []}
})

module.exports = mongoose.model('aasdaapplys', schema)