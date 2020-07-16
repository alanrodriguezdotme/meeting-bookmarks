import React, { createContext, useContext } from 'react'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { GlobalContext } from './GlobalContext'

let subscriptionKey = 'ab3918c52b51410cae05d545fe5ce17f'
let authEndpoint = 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issuetoken'
let authToken
let serviceRegion = "westus"
let recognizer
let utterance
let timers = []
let seconds = 0

export const STTContext = createContext()

const STTContextProvider = (props) => {
	let { setUtterance, appendTranscript, toggleIsRecording, setDuration } = useContext(GlobalContext)

	const requestAuthToken = () => {
		if (authEndpoint) {
			let a = new XMLHttpRequest()
			a.open("GET", authEndpoint)
			a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			a.send("")
			a.onload = function() {
				console.log('responseText:', this)
				let token = JSON.parse(atob(this.responseText.split(".")[1]))
				serviceRegion = token.region
				authToken = this.responseText
				console.log("Got an auth token: " + token)
			}
		}
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

	function startListening(actions, shouldSkipLUIS, continuous) {
		let speechConfig
		if (authToken) {
			speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authToken, serviceRegion)
		} else {
			speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion)
		}

		speechConfig.speechRecognitionLanguage = "en-US"
		let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
		recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)

		console.log("listening...")
		playEarcon('listening')
		startTimer()
		toggleIsRecording(true)

		recognizer.recognized = (sender, event) => {
			if (event.result.text) {
				appendTranscript(event.result.text, createTimestamp(seconds))
				utterance = null
				setUtterance(null)
				console.log(event.result.text)
			}
		}

		recognizer.recognizing = (sender, event) => {
			setUtterance(event.result.text)
		}

		if (continuous) {
			recognizer.startContinuousRecognitionAsync(() => {
				console.log("listening continuously...")
			}, (error) => {
				console.error(error)
				stopListening()
			})
		} else {
			recognizer.recognizeOnceAsync(
				(result) => {
					console.log(result)
					setUtterance(result.text)
					if (!shouldSkipLUIS) {
						actions.getLuisData(result.text, actions)
					}
					stopListening()
				},
				(error) => {
					console.log({error})
					stopListening()
				} 
			)
		}
	}

	const playEarcon = (state) => {
		let audio = new Audio('assets/earcons/earcon-' + state + '.wav')
		audio.play()
	}

	function stopListening() {
		if (recognizer) {
			recognizer.close()
			recognizer = undefined
			toggleIsRecording(false)
			playEarcon('stoplistening')
			stopTimer()
			console.log("stopped listening")
		}
	}

	return (
		<STTContext.Provider value={{
			requestAuthToken,
			startListening,
			stopListening
		}}>
			{props.children}
		</STTContext.Provider>
	)
}

export default STTContextProvider