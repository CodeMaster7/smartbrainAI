const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const app = express()

// ===== CONNECTING DATABASE ===== //
const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'milk',
			entries: 0,
			joined: new Date()
		}
	]
}

// ===== TOP LEVEL MIDDLEWARE ===== //
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// ====== ENDPOINTS ====== //
// /--> res = returns 'this is working'
app.get('/', (req, res) => {
    res.send(database.users)
})

// /signin --> POST = returns success/fail
app.post('/signin', (req, res) => {
	// Load hash from your password DB.
	bcrypt.compare('coco', '$2a$10$tT1puXFNX3CMb5wtTETiy.ZfOeUv39fOdetzj04.Lni3g8YwObCdq', function (err, res) {
		console.log('first guess', res);
	})
	bcrypt.compare('veggies', '$2a$10$tT1puXFNX3CMb5wtTETiy.ZfOeUv39fOdetzj04.Lni3g8YwObCdq', function (err, res) {
		console.log('second guess', res)
	})

	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0])
	} else {
		res.status(404).json('error logging in')
	}
})

// /register --> POST = returns user obj
app.post('/register', (req, res) => {
    console.log(req.body);
    const { email, name } = req.body

    database.users.push({
		id: '125',
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	})
    // grab the laset item in the array
    res.json(database.users[database.users.length - 1])
})

// /profile/:userid --> GET = user obj
app.get('/profile/:id', (req, res) => {
    console.log(req.params);
    const { id } = req.params
    let found = false

    database.users.forEach( user => {
        if (user.id === id) {
            found = true
           return res.json(user)
        }
    })
    if (!found) {
        res.status(400).json('not found')
    }
})

// /image --> POST returns user obj
app.put('/image', (req, res) => {
    console.log(req.body)
    const { id } = req.body
    let found = false

    database.users.forEach((user) => {
        if (user.id === id) {
            found = true
            user.entries++
            return res.json(user.entries)
        }
    })
    if (!found) {
		res.status(400).json('not found')
	}
});

app.listen(5000, () => console.log(`listening on port: ${5000}`))