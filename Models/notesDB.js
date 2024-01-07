const { Schema, model } = require('mongoose')

module.exports = model("NotesDB", new Schema({
    GuildID: String,
    UserID: String,
    UserTag: String,
    Content: Array
}))