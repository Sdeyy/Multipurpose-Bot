
const mongoose = require('mongoose')

const rolesData = new mongoose.Schema ({
    Guild: String,
    RoleSupport: String,
    RoleAdmin: String,
})

module.exports = mongoose.model('rolesData', rolesData)