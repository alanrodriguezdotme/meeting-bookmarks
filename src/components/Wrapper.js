import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { SpeechToTextContext } from '../contexts/SpeechToTextContext'
import Home from './Home'

const Wrapper = (props) => {
	let { initStt } = useContext(SpeechToTextContext)

	useEffect(() => {
		initStt()
	}, [])

	return (
		<WrapperDiv>
			<Home />
		</WrapperDiv>
	);
}
 
export default Wrapper;

const WrapperDiv = styled.div`
	height: 100vh;
	width: 100vw;
`