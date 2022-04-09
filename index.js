require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const { SERVER_PORT, DATABASE_URL, DB_PASSWORD } = process.env

// ===== CONNECTING DATABASE ===== //
const db = knex({
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            port: 5432,
            user: 'codemaster',
            password: DB_PASSWORD,
            database: 'smart-brain',
            connectionString: DATABASE_URL
        }
})

// ===== TOP LEVEL MIDDLEWARE ===== //
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// ====== ENDPOINTS ====== //
// /--> res = returns 'this is working'
app.get('/', (req, res) => res.send('success!!'))

// /signin --> POST = returns success/fail
// dependency ingection
app.post('/signin', signin.handleSignin(db, bcrypt))
// /register --> POST = returns user
app.post('/register', register.handleRegister(db, bcrypt))
// /profile/:userid --> GET = user obj
app.get('/profile/:id', profile.handleProfile(db))
// /image --> POST returns user obj
app.put('/image', image.handleImage(db))
app.post('/imageurl', image.handleApiCall)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || SERVER_PORT, () => console.log(`listening on port: ${process.env.PORT}`))