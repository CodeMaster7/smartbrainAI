module.exports = {
	handleRegister: (db, bcrypt) => (req, res) => {
		const { name, email, password } = req.body

        // if this is empty = true
        if (!email || !name || !password) {
            return res.status(404).json('incorrect form submission...')
        }
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
	}
}