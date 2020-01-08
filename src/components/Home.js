import React, { useContext } from 'react'
import styled from 'styled-components'

import { GlobalContext } from '../contexts/GlobalContext'
import { SpeechToTextContext } from '../contexts/SpeechToTextContext'

const Home = () => {
	let { handleMicClick, recognizerStop } = useContext(SpeechToTextContext)
	let { isRecording, transcript, utterance, addBookmark, bookmarks } = useContext(GlobalContext)

	const handleRecordClick = () => {
		if (isRecording) {
			recognizerStop()
		} else {
			handleMicClick()
		}
	}

	const renderTranscript = () => {
		console.log(bookmarks, transcript.length)
		return transcript.map((text, index) => {
			return (
				<Line>
					<Text key={ 'text' + index }>{ text }</Text>
					<Bookmark>
						{ bookmarks.includes(index) && <i className="icon icon-SingleBookmarkSolid" />
						}
					</Bookmark>
				</Line>
			)
		})
	}

	const handleBookmarkClick = () => {
		// if (utterance) {
		// 	addBookmark(transcript.length)
		// } else {
			addBookmark(transcript.length - 1)
		// }
	}

	let recordButtonClasses = isRecording ? 'icon icon-StopSolid' : 'icon icon-Record'

	return (
		<Container>
			<Top>
				{ transcript.length > 0 && renderTranscript() }
				<UtteranceContainer>{ utterance && utterance }</UtteranceContainer>
			</Top>
			<Bottom>
				<Left></Left>
				<Middle>					
					<Button onClick={ () => handleRecordClick() }>
						<i className={ recordButtonClasses } />
					</Button>
				</Middle>
				<Right>
					<Button onClick={ () => isRecording && transcript.length > 0 && handleBookmarkClick() }>
						<i className={ isRecording && transcript.length > 0 ? "icon icon-SingleBookmark" : "icon icon-SingleBookmark disabled"} />
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
	height: 100vh;
	background: black;
	color: white;
`

const Top = styled.div`
	flex: 1;
	background: #333;
`

const Bottom = styled.div`
	height: 100px;
	display: flex;
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
	height: 30px;
	text-align: left;
	opacity: .75;
`

const Button = styled.div`
	cursor: pointer;
	font-size: 32px;

	.icon-Record {
		color: red;
	}

	.disabled {
		opacity: 0.5;
	}
`

const Line = styled.div`
	display: flex;
	width: 100%;
`

const Text = styled.div`
	text-align: left;
	margin-bottom: 16px;
	flex: 1;
	width: calc(100% - 30px);
`

const Bookmark = styled.div`
	width: 50px;
`