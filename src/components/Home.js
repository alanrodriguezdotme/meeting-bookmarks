import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import * as _ from 'underscore'

import { GlobalContext } from '../contexts/GlobalContext'
import { SpeechToTextContext } from '../contexts/SpeechToTextContext'
import Header from './Header'

const Home = () => {
	let { handleMicClick, recognizerStop } = useContext(SpeechToTextContext)
	let { isRecording, transcript, utterance, setUtterance, toggleBookmark, shouldBookmark, setShouldBookmark, setShowBookmarkList, bookmarksExist } = useContext(GlobalContext)
	let [ forceRender, setForceRender ] = useState(false)

	const handleRecordClick = () => {
		if (isRecording) {
			recognizerStop()
		} else {
			handleMicClick()
		}
	}

	useEffect(() => {
		console.log(bookmarksExist)
	})

	const renderTranscript = () => {
		return transcript.map((line, index) => {
			return (
				<Line key={ 'line' + index }>
					<Text>{ line.text }</Text>
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
				<div class="help-wrapper">
					<div>Tap the red record button at the bottom to start recording and transcribing your conversation. </div>
					<div>Tap the bookmark icons to bookmark the text next to it.</div>
					<div>When you're done, you can view your bookmarks by tapping the icon in the top right.</div>
					<div>Please contact the alias: "alanro" if you run into any issues or have any questions or suggestions.</div>
				</div>
			</Help>
		)
	}

	const handleLineBookmarkClick = (index) => {
		toggleBookmark(index)
		setForceRender(!forceRender)
	}

	const handleBookmarksClick = () => {
		setShowBookmarkList(true)
	}

	const handleFooterBookmarkClick = () => {
		if (utterance) {
			setShouldBookmark(true)
			console.log(shouldBookmark)
		} else {
			toggleBookmark(transcript.length - 1)
		}		
		setForceRender(!forceRender)
	}

	let recordButtonClasses = isRecording ? 'icon icon-StopSolid' : 'icon icon-Record'

	return (
		<Container>
			<Header bookmarksExist={_.findWhere(transcript, { bookmark: true }) ? true : false} right={<i onClick={ () => handleBookmarksClick() } className={ bookmarksExist ? 'icon icon-BookmarkList' : 'icon icon-BookmarkList disabled' } />} />
			<Main>
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
			<Bottom>
				<Left onClick={() => setLines(transcript)}></Left>
				<Middle>					
					<Button onClick={ () => handleRecordClick() }>
						<i className={ recordButtonClasses } />
					</Button>
				</Middle>
				<Right>
					<Button onClick={ () => isRecording && transcript.length > 0 && handleFooterBookmarkClick() }>
						<i className={ isRecording ? "icon icon-AddBookmark" : "icon icon-AddBookmark disabled"} />
					</Button>
				</Right>
			</Bottom>	
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

const Left = styled.div`
	width: 33%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Middle = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Right = styled.div`
	width: 33%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const UtteranceContainer = styled.div`
	width: calc(100% - 30px);
	height: 30px;
	text-align: left;
	opacity: .75;
	padding: 4px 10px;
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
	align-items: center;
	justify-content: center;
	width: 100%;
	margin-bottom: 16px;
	height: fit-content;
	min-height: 30px;
`

const Text = styled.div`
	text-align: left;
	flex: 1;
	width: calc(100% - 30px);
	padding: 4px 10px;
`

const Bookmark = styled.div`
	width: 50px;
	height: 100%;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;

	.disabled {
		opacity: 0.5;
	}
`