const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const indexRouter = require('./routes/indexRouter')
const portfolioRouter = require('./routes/portfolioRouter')
const coinRouter = require('./routes/coinRouter')
const passport = require('passport')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true })
const connection = mongoose.connection
connection.once('open', () => {
    console.log("Database opened")
})

require('./passport/passport')(passport);

app.use(passport.initialize())

app.use(cors())
app.use(express.json())

app.use('/', indexRouter)
app.use('/portfolios', portfolioRouter)
app.use('/coins', coinRouter)

app.listen(port, () => {
    console.log('Server is listening on port ' + port)
})