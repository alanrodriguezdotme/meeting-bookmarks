import React, { createContext, useState, useEffect } from 'react'
import * as _ from 'underscore'

export const GlobalContext = createContext()

const GlobalContextProvider = (props) => {
	let [ utterance, setUtterance ] = useState(null)
	let [ isRecording, toggleIsRecording ] = useState(false)
	let [ transcript, setTranscript ] = useState([
		// {
		// 	text: 'testing this out',
		// 	bookmark: false
		// },
		// {
		// 	text: 'more text here',
		// 	bookmark: false
		// }
	])
	let [ shouldBookmark, setShouldBookmark ] = useState(false)
	let [ showBookmarkList, setShowBookmarkList ] = useState(false)
	let [ bookmarksExist, setBookmarksExist ] = useState(false)

	useEffect(() => {
		let bookmarks = _.findWhere(transcript, { bookmark: true })
		if (!bookmarks) { setBookmarksExist(false) }
		else { setBookmarksExist(true) }
	})

	const appendTranscript = (text) => {
		let array = transcript
		array.push({ text, bookmark: shouldBookmark })
		setTranscript(array)
		setUtterance(null)
		setShouldBookmark(false)
	}

	const toggleBookmark = (index) => {
		let array = transcript
		array[index]['bookmark'] = !array[index]['bookmark']
		setTranscript(array)
	}

	return (
		<GlobalContext.Provider value={{
			utterance, setUtterance,
			transcript, setTranscript, appendTranscript,
			isRecording, toggleIsRecording, 
			toggleBookmark,
			shouldBookmark, setShouldBookmark,
			showBookmarkList, setShowBookmarkList,
			bookmarksExist
		}}>
			{ props.children }
		</GlobalContext.Provider>
	)
}

export default GlobalContextProvider