const Clarifai = require('clarifai')

const app = new Clarifai.App({
	apiKey: '49ce455d64a14e77b528a255cafb7e0a'
})


module.exports = {
    handleImage: (db) => (req, res) => {
        const { id } = req.body

		db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then((entries) => {
            res.json(entries[0].entries)
        })
        .catch((err) => res.status(400).json('unable to get count'))
	},
    handleApiCall:(req, res) => {
        app.models
			.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
			.then((data) => {
				res.json(data)
			})
			.catch((err) => res.status(400).json('unable to work with API'))
    }
}
