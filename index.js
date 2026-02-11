require('dotenv').config()
const express = require('express')
const { sequelize } = require('./models')
const userRoute =  require('./src/routes/userRoute')
const billsPaymentRoute =  require('./src/routes/billsPaymentRoute')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const port = process.env.PORT || 30000

app.use(express.json())


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
      description: 'Description of bills payment API'
    },
    contact: [
        {
            email: 'ajiboyekehinde194@gmail.com',
            name: 'Backend team'
        }
    ]
  },
  servers: [{url: `http://localhost:${port}`}],
  apis: ['./src/routes/**/*.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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


app.use('/user', userRoute)
app.use('/bills', billsPaymentRoute)