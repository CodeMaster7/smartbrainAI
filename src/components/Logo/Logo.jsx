import React from 'react'
import Tilt from 'react-parallax-tilt'
import brain from './brain.png'

const Logo = () => {
	return (
		<Tilt className='Tilt br2 shadow-2 mt0' style={{ height: 150, width: 150 }}>
			<div className='pa3 tc'>
				<img style={{ paddingTop: '5px' }} alt='logo' src={brain} />
			</div>
		</Tilt>
	)
}

export default Logo
