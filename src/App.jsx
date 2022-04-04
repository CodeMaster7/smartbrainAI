import React, { Component } from 'react'
import Particles from 'react-tsparticles'
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'

import './App.css'

const app = new Clarifai.App({
	apiKey: '49ce455d64a14e77b528a255cafb7e0a'
})

const particleOptions = {
	interactivity: {
		events: {
			onHover: {
				enable: true,
				mode: 'repulse'
			},
			resize: true
		}
	},
	particles: {
		color: {
			value: '#ffffff'
		},
		links: {
			color: '#ffffff',
			distance: 150,
			enable: true,
			opacity: 0.5,
			width: 1
		},
		move: {
			direction: 'none',
			enable: true,
			outMode: 'bounce',
			random: false,
			speed: 6,
			straight: false
		},
		number: {
			density: {
				enable: true,
				area: 800
			},
			value: 30
		},
		opacity: {
			value: 0.5
		}
	}
}

class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageUrl: '',
			box: {}
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
		const image = document.getElementById('inputimage')
		const width = Number(image.width)
		const height = Number(image.height)

		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height
		}
	}

	displayFaceBox = (box) => {
        console.log(box);
		this.setState({ box: box })
	}

	onInputChange = (event) => {
		this.setState({ input: event.target.value })
	}

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input })

		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then((response) => this.displayFaceBox(this.calculateFaceLocation(response)))
			.catch((err) => console.log(err))
	}

	render() {
		return (
			<>
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
				<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
				<Particles className='particles' options={particleOptions} />
			</>
		)
	}
}

export default App
