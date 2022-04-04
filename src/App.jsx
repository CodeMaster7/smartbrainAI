import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-tsparticles'

import './App.css'

function App() {
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

	return (
		<>
			<Navigation />
			<Logo />
			<Rank />
			<ImageLinkForm />
			{/*
            <FaceRecognition />*/}
			<Particles className='particles' options={particleOptions} />
		</>
	)
}

export default App
