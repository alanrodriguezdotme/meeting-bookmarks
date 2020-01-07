import React, { useContext } from 'react'
import styled from 'styled-components'


const Wrapper = (props) => {

	return (
		<WrapperDiv>
			{props.children}
		</WrapperDiv>
	);
}
 
export default Wrapper;

const WrapperDiv = styled.div`
	height: 100vh;
	width: 100vw;
`