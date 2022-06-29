const express = require('express')
const colors = require('colors')
const bodyParser = require('body-parser')
const connectDB = require('./db/connection')

const dotenv = require('dotenv').config()

const app = express()
connectDB()

app.use(bodyParser.json())

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/restraunts', require('./routes/restrauntRoute'))

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
