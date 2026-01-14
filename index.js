require('dotenv').config()
const express = require('express')
const { sequelize } = require('./models')
const userRoute =  require('./src/routes/userRoute')
const app = express()
const port = process.env.PORT || 30000

app.use(express.json())

sequelize.authenticate()
    .then(result => {
        console.log('Database connected'),
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    }).catch(err => {
        console.log('Error connectiing to database', err)
    })



app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.use(userRoute)