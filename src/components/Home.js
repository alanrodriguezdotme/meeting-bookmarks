import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import * as _ from 'underscore'

import { GlobalContext } from '../contexts/GlobalContext'
import { SpeechToTextContext } from '../contexts/SpeechToTextContext'
import Header from './Header'
import Controls from './Controls'
import { notStrictEqual } from 'assert'

const Home = () => {
	let { recognizerStop } = useContext(SpeechToTextContext)
	let { isRecording, transcript, setTranscript, utterance, setUtterance, toggleBookmark, shouldBookmark, setShouldBookmark, setShowBookmarkList, bookmarksExist, shouldReset, setShouldReset } = useContext(GlobalContext)
	let [ forceRender, setForceRender ] = useState(false)
	let [ referenceNode, setReferenceNode ] = useState()
	let [ scrolledToBottom, setScrolledToBottom ] = useState(false)

	useEffect(() => {
		return () => referenceNode.removeEventListener('scroll', trackScrolling)
	}, [])

	useEffect(() => {
		if (scrolledToBottom && isRecording) {			
			referenceNode.scrollTo(0, referenceNode.scrollHeight)
		}
	})

	const trackScrolling = (event) => {
		let node = event.target
		const bottom = node.scrollHeight - node.scrollTop === node.clientHeight
		if (bottom) {
			setScrolledToBottom(true)
		} else {
			setScrolledToBottom(false)
		}

	}

	const renderTranscript = () => {
		return transcript.map((line, index) => {
			return (
				<Line key={ 'line' + index }>
					<Content>
						<Timestamp>{ line.timestamp }</Timestamp>
						<Text>{ line.text }</Text>
					</Content>
					<Bookmark onClick={ () => handleLineBookmarkClick(index) }>
						<i className={ line.bookmark ? "icon icon-SingleBookmarkSolid" : "icon icon-AddBookmark disabled" } />
					</Bookmark>
				</Line>
			)
		})
	}

	const renderHelp = () => {
		return (
			<Help>
				<div className="help-wrapper">
					<div>Tap the red record button at the bottom to start recording and transcribing your conversation. </div>
					<div>Tap the bookmark icons to bookmark the text next to it.</div>
					<div>When you're done, you can view your bookmarks by tapping the icon in the top right.</div>
					<div>Please contact the alias: "alanro" if you run into any issues or have any questions or suggestions.</div>
					<div>Currently only works on desktop or Android.</div>
				</div>
			</Help>
		)
	}

	const mainDidMount = (node) => {
		if (node) {
			node.addEventListener('scroll', trackScrolling)
			setReferenceNode(node)
		}
	}

	const handleLineBookmarkClick = (index) => {
		toggleBookmark(index)
		setForceRender(!forceRender)
	}

	const handleBookmarksClick = () => {
		setShowBookmarkList(true)
	}

	const clearTranscript = () => {
		recognizerStop()
		setTranscript([])
		setShouldReset(true)
	}

	return (
		<Container>
			<Header
				transcriptExist={ transcript.length > 0 }
				left={ <i 
					onClick={ () => clearTranscript() }
					className={ transcript.length > 0 ? 'icon icon-Clear' : null } /> }
				bookmarksExist={ _.findWhere(transcript, { bookmark: true }) ? true : false } 
				right={ <i 
					onClick={ () => handleBookmarksClick() } 
					className={ bookmarksExist ? 'icon icon-BookmarkList' : 'icon icon-BookmarkList disabled' } /> 
					} />
			<Main id='main' ref={ mainDidMount }>
				{ transcript.length > 0 || isRecording ? renderTranscript() : renderHelp() }
				{ utterance && 
					<Line>
						<UtteranceContainer>{ utterance && utterance }</UtteranceContainer>
						<Bookmark onClick={ () => handleLineBookmarkClick(index) }>
							{ shouldBookmark && <i className="icon icon-SingleBookmarkSolid" /> }
						</Bookmark>
					</Line>
				}
			</Main>
			<Controls 
				isRecording={ isRecording }
				shouldReset={ shouldReset } />
		</Container>
	)
}

export default Home

const Container = styled.div`
	text-align: center;
	display: flex;
	flex-direction: column;
	height: 100%;
	background: black;
	color: white;
	width: 100vw;
	overflow: hidden;
`

const Main = styled.div`
	flex: 1;
	background: #333;
	overflow-y: auto;
	overflow-x: hidden;
`

const Help = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	opacity: 0.5;

	.help-wrapper {
		width: 66%;

		div {
			margin-bottom: 10px;
			line-height: 20px;
		}
	}
`

const Bottom = styled.div`
	height: 100px;
	display: flex;
	font-size: 32px;
`

const UtteranceContainer = styled.div`
	width: calc(100% - 30px);
	text-align: left;
	opacity: .75;
	padding: 8px 16px;
	flex: 1;
`

const Button = styled.div`
	cursor: pointer;
	width: 100%;
	height: 100%;

	.icon {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-Record {
		color: red;
	}

	.disabled {
		opacity: 0.35;
	}
`

const Line = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	margin-bottom: 16px;
	height: fit-content;
	min-height: 30px;
`

const Content = styled.div`
	text-align: left;
	flex: 1;
	width: calc(100% - 30px);
	padding: 8px 16px;
`

const Timestamp = styled.div`
	font-size: 10px;
	opacity: 0.5;
`

const Text = styled.div`
	width: 100%;
`

const Bookmark = styled.div`
	width: 50px;
	height: 100%;
	font-size: 16px;
	display: flex;
	align-items: flex-start;
	justify-content: center;

	.icon {
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 12px;
	}

	.disabled {
		opacity: 0.5;
	}
`