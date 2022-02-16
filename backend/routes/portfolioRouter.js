const router = require('express').Router()
const passport = require('passport')
const Portfolio = require('../models/portfolio')
const extractOwnerId = require('../utils/extractOwnerId')

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const token = req.headers.authorization
    const currentOwner = extractOwnerId(token)
    try {
        const portfolios = await Portfolio.find({ owner: currentOwner })
        res.status(200).json({ success: true, portfolios: portfolios })
    } catch (err) {
        res.status(500).json({ success: false, error: err, msg: "Error displaying portfolios, please try again" })
    }
})

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = req.headers.authorization
    const owner = extractOwnerId(token)

    const newPortfolio = new Portfolio({
        name: req.body.name,
        picture: req.body.picture,
        owner: owner
    })

    newPortfolio.save().then(
        res.status(200).json({ success: true, newPortfolio: newPortfolio, msg: "Successfully created a new portfolio" })
    )
})

router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const portfolioId = req.body.portfolioId
    try {
        await Portfolio.deleteOne({ portfolioId })
        res.status(200).json({ success: true, msg: "The portfolio has been successfully deleted" })
    } catch (err) {
        res.status(500).json({ success: false, error: err, msg: "Error deleting portfolio, please try again" })
    }

})

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await Portfolio.updateOne({ _id: req.body.portfolioId }, { $set: { name: req.body.name, picture: req.body.picture } })
        res.status(200).json({ success: true, msg: "The portfolio has been successfully updated" })
    } catch (err) {
        res.status(500).json({ success: false, error: err, msg: "Error updating the portfolio, please try again" })
    }
})

//----------INSIDE PORTFOLIO----------//

router.get('/:id', (req, res) => {
    res.send('portfolio with id: ' + req.params.id)
})

module.exports = router