const mongoose = require('mongoose')

const PortfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Portfolio', PortfolioSchema)