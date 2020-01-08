import React, { createContext, useState } from 'react'

export const GlobalContext = createContext()

const GlobalContextProvider = (props) => {
	let [ utterance, setUtterance ] = useState(null)
	let [ transcript, setTranscript ] = useState([])
	let [ isRecording, toggleIsRecording ] = useState(false)
	let [ bookmarks, setBookmarks ] = useState([])

	const appendTranscript = (text) => {
		let array = transcript
		array.push(text)
		setTranscript(array)
	}

	const addBookmark = (index) => {
		console.log(index, bookmarks)
		let array = bookmarks
		array.push(index)
		setBookmarks(array)
	}

	return (
		<GlobalContext.Provider value={{
			utterance, setUtterance,
			transcript, setTranscript, appendTranscript,
			isRecording, toggleIsRecording,
			bookmarks, setBookmarks, addBookmark
		}}>
			{ props.children }
		</GlobalContext.Provider>
	)
}

export default GlobalContextProvider