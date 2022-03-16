const router = require('express').Router()
const axios = require('axios')
const passport = require('passport')


router.get('/', (req, res) => {
    let coinName = req.query.coin
    res.send('all coins ' + coinName)
})

router.get('/:id', (req, res) => {
    id = req.params.id
    res.send('all info about the coin with id ' + id)
})


module.exports = router