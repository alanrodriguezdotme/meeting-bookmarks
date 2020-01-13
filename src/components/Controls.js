import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { SpeechToTextContext } from '../contexts/SpeechToTextContext'
import { GlobalContext } from '../contexts/GlobalContext'

let timers = []

const Controls = ({ isRecording, shouldReset }) => {
	let { recognizerStop, handleMicClick } = useContext(SpeechToTextContext)
	let { setShouldReset, toggleBookmark, transcript, shouldBookmark, setShouldBookmark, utterance } = useContext(GlobalContext)
	let [ duration , setDuration ] = useState(0)
	let [ forceRender, setForceRender ] = useState(false)

	useEffect(() => {
		if (shouldReset) {
			stopTimer()
			setDuration(0)
			setShouldReset(false)
		}
	}, [shouldReset])

	const handleRecordClick = () => {
		if (isRecording) {
			recognizerStop()
			stopTimer()
		} else {
			handleMicClick()
			startTimer()
		}
	}

	const startTimer = () => {
		timers.push(setInterval(() => {
			setDuration(duration++)
		}, 1000))
	}

	const stopTimer = () => {
		for (let i = 0; i < timers.length; i++) {
			clearInterval(timers[i])
		}
	}

	const handleFooterBookmarkClick = () => {
		if (utterance) {
			setShouldBookmark(true)
		} else {
			toggleBookmark(transcript.length - 1)
		}		
		setForceRender(!forceRender)
	}

	const renderDuration = () => {
		let hours = Math.floor(duration / 60)
		let minutes = duration % 60
		hours = hours > 9 ? hours : '0' + hours
		minutes = minutes > 9 ? minutes : '0' + minutes

		return (
			<Timestamp>
				<span className="hours">
					{ hours }
				</span>:
				<span className="minutes">
					{ minutes }
				</span>
			</Timestamp>
		)
	}

	let recordButtonClasses = isRecording ? 'icon icon-StopSolid' : 'icon icon-Record'
	let fabuttonClasses = isRecording ? 'show' : 'hide'

	return (
		<Container>
			<Left>									
				<Button onClick={ () => handleRecordClick() }>
					<i className={ recordButtonClasses } />
				</Button>
			</Left>
			<Middle>
				{ renderDuration() }
			</Middle>
			<Right>
				<FAButton 
					className={ fabuttonClasses }
					onClick={ () => isRecording && transcript.length > 0 && handleFooterBookmarkClick() }>
					<i className={ isRecording ? "icon icon-AddBookmark" : "icon icon-AddBookmark disabled"} />
				</FAButton>
			</Right>
		</Container>
	)
}

export default Controls

const Container = styled.div`
	width: 100%;
	height: 50px;
	display: flex;
	font-size: 32px;
`

const Left = styled.div`
	width: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Middle = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-start;
`

const Right = styled.div`
	width: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Timestamp = styled.div`
	font-size: 16px;
	margin: 0 8px;
`

const Button = styled.div`
	font-size: 24px;
	display: flex;
	align-items: center;
	justify-content: center;

	.icon-Record {
		color: red;
	}

	.icon-StopSolid {
		font-size: 18px;
	}
`

const FAButton = styled.div`
	width: 70px;
	height: 70px;
	border-radius: 35px;
	background: purple;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 3px rgba(0,0,0,0.35);
	transform: translateY(-25px);
	font-size: 32px;
	cursor: pointer;
	transition: all 350ms cubic-bezier(0.19, 1, 0.22, 1);

	.icon {
		transition: all 350ms cubic-bezier(0.19, 1, 0.22, 1);
		opacity: 1;
		transform: scale(1);
	}

	&.hide {
		width: 0;
		height: 0;

		.icon {
			transform: scale(0.1);
			opacity: 0;
		}
	}
`