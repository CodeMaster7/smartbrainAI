const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

// ===== CONNECTING DATABASE ===== //
const db = knex({
    client: 'pg',
	connection: {
        host: '127.0.0.1',
		port: 5432,
		user: 'codemaster',
		password: 'root',
		database: 'smart-brain'
	}
})

// ===== TOP LEVEL MIDDLEWARE ===== //
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// ====== ENDPOINTS ====== //
// /--> res = returns 'this is working'
app.get('/', (req, res) => {
    res.send('success!!')
})

// /signin --> POST = returns success/fail
// dependency ingection
app.post('/signin', signin.handleSignin(db, bcrypt))
// /register --> POST = returns user
app.post('/register', register.handleRegister(db, bcrypt))
// /profile/:userid --> GET = user obj
app.get('/profile/:id', profile.handleProfile(db))
// /image --> POST returns user obj
app.put('/image', image.handleImage(db));

app.listen(5000, () => console.log(`listening on port: ${5000}`))