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

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const token = req.headers.authorization
    const owner = extractOwnerId(token)

    const existingPortfolios = await Portfolio.find({ owner: owner })

    if (existingPortfolios.length < 5) {

        const newPortfolio = new Portfolio({
            name: req.body.name,
            picture: req.body.picture,
            owner: owner,
            spent: 0,
            coins: []
        })

        newPortfolio.save().then(
            res.status(200).json({ success: true, newPortfolio: newPortfolio, msg: "Successfully created a new portfolio" })
        )
    } else {
        res.status(400).json({ success: false, msg: "the maximum of 3 portfolios can be created" })
    }
})

router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

    const portfolioId = req.body.portfolioId
    try {
        await Portfolio.deleteOne({ _id: portfolioId })
        res.status(200).json({ req: portfolioId, success: true, msg: "The portfolio has been successfully deleted" })
    } catch (err) {
        res.status(500).json({ success: false, error: err, msg: "Error deleting portfolio, please try again" })
    }

})

router.put('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await Portfolio.updateOne({ _id: req.body.portfolioId }, { $set: { name: req.body.name, picture: req.body.picture } })
        const updatedPortfolio = await Portfolio.find({ _id: req.body.portfolioId })
        res.status(200).json({ success: true, updatedPortfolio: updatedPortfolio[0], msg: "The portfolio has been successfully updated" })
    } catch (err) {
        res.status(500).json({ success: false, error: err, msg: "Error updating the portfolio, please try again" })
    }
})

//----------INSIDE PORTFOLIO----------//

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const id = req.params.id.toString().replace(':', '')
    console.log(id)

    const portfolio = await Portfolio.findOne({ _id: id })

    const token = req.headers.authorization
    const owner = extractOwnerId(token)

    try {
        if (portfolio && portfolio.owner === owner) {
            res.status(200).json({
                success: true, portfolio: {
                    _id: portfolio._id,
                    name: portfolio.name,
                    picture: portfolio.picture,
                    coins: portfolio.coins
                }
            })
        } else {
            res.status(404).json({ success: false, msg: "Such portfolio doesn't exist" })
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err, msg: 'Error getting a portfolio, try again later' })
        console.log(err)
    }
})

module.exports = router


//-----Coin Operations-----//

router.put('/addCoin', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //get all the necessary parameters
    const addedCoin = req.body.coin
    const id = req.body.portfolioId
    const newSpent = req.body.spent

    //extract token and userID for portfolio verification
    const token = req.headers.authorization
    const owner = extractOwnerId(token)

    //check if portfolio exists
    const portfolio = await Portfolio.findOne({ _id: id })

    try {
        if (portfolio && portfolio.owner === owner) {
            //portfolio where we want to add the coin, needed for comparisons
            const oldPortfolio = await Portfolio.findOne({ _id: id })

            //iterate through the coins array of the oldPortfolio to find if there's already a coin with the given id
            for (let i = 0; i < oldPortfolio.coins.length; i++) {
                console.log('made it into the loop')
                if (oldPortfolio.coins[i]['id'] === addedCoin.id) {
                    console.log('updated amount')
                    await Portfolio.updateOne({ _id: id, 'coins.id': addedCoin.id }, { $inc: { 'coins.$.amount': addedCoin.amount } })
                    await Portfolio.updateOne({ _id: id }, { $inc: { spent: newSpent } })
                    break
                }

                //if not, add one
                if (i === oldPortfolio.coins.length - 1) {
                    await Portfolio.updateOne({ _id: id }, { $push: { coins: addedCoin } })
                    await Portfolio.updateOne({ _id: id }, { $inc: { spent: newSpent } })
                }
            }

            //if the coins array is empty, add one
            if (oldPortfolio.coins.length === 0) {
                await Portfolio.updateOne({ _id: id }, { $push: { coins: addedCoin } })
                await Portfolio.updateOne({ _id: id }, { $inc: { spent: newSpent } })
            }

            //return the updated portfolio for displaying on the frontend
            const updatedPortfolio = await Portfolio.find({ _id: id })

            res.status(200).json({ success: true, updatedPortfolio: updatedPortfolio[0], msg: "The coin has been successfully added" })

            //error handling
        } else {
            res.status(400).json({ success: false, msg: "Error accessing portflio" })
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err, msg: 'Error getting a portfolio, try again later' })
        console.log(err)
    }
})