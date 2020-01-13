import React, { createContext, useState, useEffect } from 'react'
import * as _ from 'underscore'

export const GlobalContext = createContext()

const GlobalContextProvider = (props) => {
	let [ utterance, setUtterance ] = useState(null)
	let [ isRecording, toggleIsRecording ] = useState(false)
	let [ transcript, setTranscript ] = useState([])
	let [ shouldBookmark, setShouldBookmark ] = useState(false)
	let [ showBookmarkList, setShowBookmarkList ] = useState(false)
	let [ bookmarksExist, setBookmarksExist ] = useState(false)
	let [ shouldReset, setShouldReset ] = useState(false)

	useEffect(() => {
		if (shouldBookmark) {
			let array = transcript
			array[array.length - 1].bookmark = true
			setTranscript(array)
			setShouldBookmark(false)
		}

		console.log(transcript)
	}, [transcript])

	useEffect(() => {
		let bookmarks = _.findWhere(transcript, { bookmark: true })
		if (!bookmarks) { setBookmarksExist(false) }
		else { setBookmarksExist(true) }
	})

	let appendTranscript = (text) => {
		let array = transcript
		let newObject = { text, bookmark: shouldBookmark }
		array.push(newObject)
		setTranscript([...array])
		setUtterance(null)
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
			shouldReset, setShouldReset
		}}>
			{ props.children }
		</GlobalContext.Provider>
	)
}

export default GlobalContextProvider