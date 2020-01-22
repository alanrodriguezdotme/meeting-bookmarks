import React, { createContext, useContext, useEffect } from 'react'
import * as SDK from 'microsoft-speech-browser-sdk'

import { GlobalContext } from '../contexts/GlobalContext'

let subscriptionKey = '5bb1fd777df040f18623d946d3ae2833'
let serviceRegion = 'westus'
let recognizer
let utterance
let timers = []
let seconds = 0

export const SpeechToTextContext = createContext()

const SpeechToTextContextProvider = (props) => {
	let { setUtterance, appendTranscript, toggleIsRecording, setDuration } = useContext(GlobalContext)

	useEffect(() => {
		// restarting recognizer after 10 minute limit
		if (seconds == 600) {
			recognizerStop()
			initStt()
			handleMicClick()
		}
	}, [seconds])

	const initStt = () => {
		recognizer = recognizerSetup(
			SDK,
			SDK.RecognitionMode.Dictation,
			'en-US',
			'Detailed',
			subscriptionKey
		)
	}

	const startTimer = () => {
		timers.push(setInterval(() => {
			seconds++
			setDuration(seconds)
		}, 1000))
	}

	const stopTimer = () => {
		for (let i = 0; i < timers.length; i++) {
			clearInterval(timers[i])
		}
	}

	const createTimestamp = (time) => {
		let hours = Math.floor(time / 60)
		let minutes = time % 60
		hours = hours > 9 ? hours : '0' + hours
		minutes = minutes > 9 ? minutes : '0' + minutes

		return hours + ':' + minutes
	}

	const recognizerSetup = (SDK, recognitionMode, language, format, subscriptionKey) => {
		let recognizerConfig = new SDK.RecognizerConfig(
			new SDK.SpeechConfig(
				new SDK.Context(
					new SDK.OS(navigator.userAgent, "Browser", null),
					new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
			recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
			language, // Supported languages are specific to each recognition mode Refer to docs.
			format) // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

		// Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    let authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey)

		return SDK.CreateRecognizer(recognizerConfig, authentication)
	}

	const playEarcon = (state) => {
		let audio = new Audio('assets/earcons/earcon-' + state + '.wav')
		audio.play()
	}

	const handleMicClick = (actions) => {
		recognizerStart(SDK, recognizer, actions)
  }

	const recognizerStart = (SDK, recognizer, actions) => {
		recognizer.Recognize((event) => {
			switch (event.Name) {
				case "RecognitionTriggeredEvent":
					console.log("Initializing")
					startTimer()
					playEarcon('listening')
					break
				case "ListeningStartedEvent":
					toggleIsRecording(true)
					console.log("Listening")
					break
				case "RecognitionStartedEvent":
					console.log("Listening_Recognizing")
					break
				case "SpeechStartDetectedEvent":
					console.log("Listening_DetectedSpeech_Recognizing")
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					break
				case "SpeechHypothesisEvent":
					// setShowUtterance(true)
					console.log("SpeechHypothesisEvent")
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					break
				case "SpeechFragmentEvent":
					console.log("SpeechFragmentEvent")
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					utterance ? utterance += (' ' + event.Result.Text) : utterance = event.Result.Text

					if (utterance) {
						setUtterance(utterance)
					}
					break
				case "SpeechEndDetectedEvent":
					console.log("SpeechEndDetectedEvent")
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					break
				case "SpeechSimplePhraseEvent":
					console.log("SpeechSimplePhraseEvent")
					break
				case "SpeechDetailedPhraseEvent":
					console.log("SpeechDetailedPhraseEvent")
					if (event.Result.NBest) {
						appendTranscript(event.Result.NBest[0].ITN, createTimestamp(seconds))
						utterance = null
						setUtterance(null)
					}
					break
				case "RecognitionEndedEvent":
					console.log("RecognitionEndedEvent")					
					if (event.Result.NBest) {
						console.log(event.Result.NBest[0].ITN)
					}					
					toggleIsRecording(false)
					playEarcon('stoplistening')
					stopTimer()
					break
			}
		})
			.On(() => {
				// The request succeeded. Nothing to do here.
			},
			(error) => {
				error && console.error('STT error', error)
				// this.init()
			})
	}

	const recognizerStop = () => {
		if (recognizer) {
			recognizer.AudioSource.TurnOff()
		} else {
			initStt()
		}
		
		stopTimer()
		toggleIsRecording(false)
		setUtterance(null)
		utterance = null
	}

	return (
		<SpeechToTextContext.Provider value={{ initStt, handleMicClick, recognizerStop, recognizerSetup }}>
			{ props.children }
		</SpeechToTextContext.Provider>
	)
}

export default SpeechToTextContextProvider