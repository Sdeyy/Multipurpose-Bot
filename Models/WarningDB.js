const { Schema, model } = require('mongoose')

module.exports = model("WaningDB", new Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Content: Array
}))