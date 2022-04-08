const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')


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
app.post('/signin', (req, res) => {
	db.select('email', 'hash')
		.from('login')
		.where('email', '=', req.body.email)
		.then((data) => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
			if (isValid) {
				return db
					.select('*')
					.from('users')
					.where('email', '=', req.body.email)
					.then((user) => {
						res.json(user[0])
					})
					.catch((err) => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch((err) => res.status(400).json('wrong credentials'))
})

// /register --> POST = returns user obj
app.post('/register', (req, res) => {
	const { name, email, password } = req.body
	//Get the hash
	const hash = bcrypt.hashSync(password)

	//Start transaction
	db.transaction((trx) => {
		//Insert into login table
		trx.insert({
			hash: hash,
			email: email
		})
        .into('login')
        .returning('email')
        .then((loginEmail) => {
			//Insert into users table
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0].email,
					name: name,
					joined: new Date()
				})
				.then((user) => {
					res.json(user[0])
				})
		})
        .then(trx.commit)
        .catch(trx.rollback)
	}).catch((err) => res.status(400).json('unable to register...'))
})

// /profile/:userid --> GET = user obj
app.get('/profile/:id', (req, res) => {
    const { id } = req.params

    db.select('*').from('users')
        .where({id: id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('user not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

// /image --> POST returns user obj
app.put('/image', (req, res) => {
    const { id } = req.body

    db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries)
		})
		.catch(err => res.status(400).json('unable to get count'))
});

app.listen(5000, () => console.log(`listening on port: ${5000}`))