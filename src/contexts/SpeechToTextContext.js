import React, { createContext, useContext } from 'react'
import * as SDK from 'microsoft-speech-browser-sdk'

import { GlobalContext } from '../contexts/GlobalContext'

let subscriptionKey = '5bb1fd777df040f18623d946d3ae2833'
let serviceRegion = 'westus'
let recognizer
let utterance

export const SpeechToTextContext = createContext()

const SpeechToTextContextProvider = (props) => {
	let { setUtterance, appendTranscript, toggleIsRecording } = useContext(GlobalContext)

	const initStt = () => {
		recognizer = recognizerSetup(
			SDK,
			SDK.RecognitionMode.Dictation,
			'en-US',
			'Detailed',
			subscriptionKey
		)
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
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					break
				case "SpeechFragmentEvent":
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					utterance ? utterance += (' ' + event.Result.Text) : utterance = event.Result.Text

					if (utterance) {
						setUtterance(utterance)
					}
					break
				case "SpeechEndDetectedEvent":
					console.log("Processing_Adding_Final_Touches")
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					break
				case "SpeechSimplePhraseEvent":
					break
				case "SpeechDetailedPhraseEvent":
					if (event.Result.NBest) {
						console.log(event.Result.NBest[0].ITN)
						utterance = null
						appendTranscript(event.Result.NBest[0].ITN)
					}
					break
				case "RecognitionEndedEvent":
					if (event.Result.NBest) {
						console.log(event.Result.NBest[0].ITN)
					}					
					toggleIsRecording(false)
					playEarcon('stoplistening')
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