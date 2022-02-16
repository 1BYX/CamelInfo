const router = require('express').Router()


router.get('/', (req, res) => {
    let coinName = req.query.coin
    res.send('all coins ' + coinName)
})

router.post('/add', (req, res) => {
    let coinType = req.body.coinType
    let coinAmount = req.body.coinAmount
    let wallet = req.body.walletId

    res.send(`adding ${coinAmount} ${coinType} to your wallet ` + wallet)
})

router.get('/:id', (req, res) => {
    id = req.params.id
    res.send('all info about the coin with id ' + id)
})


module.exports = router