import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { SpeechToTextContext } from '../contexts/SpeechToTextContext'
import Home from './Home'
import BookmarkList from './BookmarkList'
import { GlobalContext } from '../contexts/GlobalContext'

const Wrapper = (props) => {
	let { initStt } = useContext(SpeechToTextContext)
	let { showBookmarkList } = useContext(GlobalContext)

	useEffect(() => {
		initStt()
	}, [])

	return (
		<WrapperDiv showBookmarkList={ showBookmarkList }>
			<Home />
			<BookmarkList />
		</WrapperDiv>
	);
}
 
export default Wrapper;

const WrapperDiv = styled.div`
	height: 100vh;
	width: 200vw;
	display: flex;
	overflow: hidden;
	transform: ${ p => p.showBookmarkList ? 'translateX(-100vw)' : 'translateX(0)' };
	transition: transform 350ms cubic-bezier(0.19, 1, 0.22, 1);
`