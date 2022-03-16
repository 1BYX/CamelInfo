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
    },
    spent: {
        type: Number,
        required: true
    },
    coins: {
        type: [{
            id: String,
            name: String,
            image: String,
            amount: Number,
        }],
        required: true
    }
})

module.exports = mongoose.model('Portfolio', PortfolioSchema)