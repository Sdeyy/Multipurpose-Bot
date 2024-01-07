const mongoose = require('mongoose');

const ecoSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    money: {type: Number, default: 500},
    bank: {type: Number, default: 100},
    daily: String,
    work: String,
})

const model = mongoose.model("economy", ecoSchema);

module.exports = model;