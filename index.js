require('dotenv').config()

const path = require('path')
const express = require('express')
const axios = require('axios').default
const cookieParser = require('cookie-parser')
const csurf = require('csurf')
const app = express()
const PORT = process.env.PORT || 3000
const BASEURL = process.env.COUNTRY_API

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, './views'))
app.use(
    cookieParser(process.env.COOKIE_SECRET, {
        httpOnly: true,
        signed: true,
        maxAge: 86400,
    })
)
app.use(csurf({ cookie: true }))
app.use((req, res, next) => {
    app.locals.csrfToken = req.csrfToken()
    next()
})

app.get('/', (req, res, next) => {
    res.render('index', {})
})

app.post('/', async (req, res, next) => {
    try {
        const name = req.body.countryName.trim()
        const country = await axios.get(`${BASEURL}/${name}`)
        res.render('index', { country: country.data[0] })
    } catch (err) {
        if (err.response?.status === 404) {
            res.render('index')
        } else {
            next(err)
        }
    }
})

app.use('*', (req, res, next) => {
    res.send('<h1>Route not defined</h1>')
})
app.use((error, req, res, next) => {
    res.send('<h1>Something went wrong. Please try again later</h1>')
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} 🔥`)
})
