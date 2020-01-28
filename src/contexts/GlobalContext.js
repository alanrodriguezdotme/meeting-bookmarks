import React, { createContext, useState, useEffect } from 'react'
import * as _ from 'underscore'

export const GlobalContext = createContext()

const GlobalContextProvider = (props) => {
	let [ utterance, setUtterance ] = useState(null)
	let [ isRecording, toggleIsRecording ] = useState(false)
	let [ transcript, setTranscript ] = useState([
		// {
		// 	text: 'testing',
		// 	bookmark: true,
		// 	timestamp: '00:00'
		// },
		// {
		// 	text: 'more testing',
		// 	bookmark: true,
		// 	timestamp: '00:02'
		// },
		// {
		// 	text: 'testing',
		// 	bookmark: true,
		// 	timestamp: '00:00'
		// },
		// {
		// 	text: 'more testing',
		// 	bookmark: true,
		// 	timestamp: '00:02'
		// }
	])
	let [ shouldBookmark, setShouldBookmark ] = useState(false)
	let [ showBookmarkList, setShowBookmarkList ] = useState(false)
	let [ bookmarksExist, setBookmarksExist ] = useState(false)
	let [ shouldReset, setShouldReset ] = useState(false)
	let [ duration , setDuration ] = useState(0)
	let [ timestamp, setTimestamp ] = useState('00:00')

	useEffect(() => {
		let bookmarks = _.findWhere(transcript, { bookmark: true })
		if (!bookmarks) { setBookmarksExist(false) }
		else { setBookmarksExist(true) }
	})

	useEffect(() => {
		if (shouldBookmark) {
			let array = transcript
			array[array.length - 1].bookmark = true
			setTranscript(array)
			setShouldBookmark(false)
		}
	}, [transcript])

	useEffect(() => {
		setTimestamp(createTimestamp(duration))
	}, [duration])

	const createTimestamp = (seconds) => {
		let hours = Math.floor(seconds / 60)
		let minutes = seconds % 60
		hours = hours > 9 ? hours : '0' + hours
		minutes = minutes > 9 ? minutes : '0' + minutes

		return hours + ':' + minutes
	}

	const appendTranscript = (text, time) => {
		console.log('appendTranscript', time)
		let array = transcript
		let newObject = { text, bookmark: shouldBookmark, timestamp: time }
		array.push(newObject)
		setTranscript([...array])
	}

	const toggleBookmark = (index) => {
		let array = transcript
		array[index]['bookmark'] = !array[index]['bookmark']
		setTranscript([...array])
	}

	return (
		<GlobalContext.Provider value={{
			utterance, setUtterance,
			transcript, setTranscript, appendTranscript,
			isRecording, toggleIsRecording, 
			toggleBookmark,
			shouldBookmark, setShouldBookmark,
			showBookmarkList, setShowBookmarkList,
			bookmarksExist,
			shouldReset, setShouldReset,
			duration , setDuration,
			timestamp
		}}>
			{ props.children }
		</GlobalContext.Provider>
	)
}

export default GlobalContextProvider