import React, { useState, useContext, useEffect } from 'react'
import * as _ from 'underscore'
import styled from 'styled-components'

import { GlobalContext } from '../contexts/GlobalContext'
import Header from './Header'

const BookmarkList = () => {
	let { transcript, setShowBookmarkList, setTranscript } = useContext(GlobalContext)
	let [ textToEdit, setTextToEdit ] = useState('')
	let [ indexToEdit, setIndexToEdit ] = useState(null)
	let [ textArea, setTextArea ] = useState(React.createRef())

	useEffect(() => {
		if (indexToEdit != null && textArea) {
			textArea.current.focus()
			textArea.current.setSelectionRange(textToEdit.length, textToEdit.length)
		}
	}, [indexToEdit])

	const renderBookmarks = () => {
		// if (bookmarks) {
			return transcript.map((line, index) => {
				if (line.bookmark) {
					return (
						<Line key={ 'bookmarkLine' + index }>
							<Content>
								<Timestamp>{ line.timestamp }</Timestamp>
								{ indexToEdit == index ? 
									renderTextArea()
									:
									<Text onClick={() => editText(line, index)}>{ line.text }</Text>
								}
							</Content>
							<Bookmark onClick={ () => handleLineBookmarkClick(index) }>
								<i className={ line.bookmark ? "icon icon-SingleBookmarkSolid" : "icon icon-AddBookmark disabled" } />
							</Bookmark>
						</Line>
					)
				}
			})
		// }
	}

	const handleLineBookmarkClick = (index) => {
		let array = transcript
		array[index].bookmark = !array[index].bookmark
		setTranscript([...array])
	}

	const editText = (line, index) => {
		setTextToEdit(line.text)
		setIndexToEdit(index)
	}

	const handleTextAreaChange = (event) => {
		setTextToEdit(event.target.value)
	}

	const handleTextAreaEnter = (event) => {
		if (event.key === 'Enter') {
			let array = transcript
			array[indexToEdit].text = textToEdit
			setTranscript([...array])
			setIndexToEdit(null)
			setTextToEdit(null)
			setTextArea(null)
		}
	}

	const renderTextArea = () => {
		return (
			<TextField
				ref={ textArea }
				value={ textToEdit }
				// onFocus={ }
				onChange={ handleTextAreaChange }
				onKeyPress={ handleTextAreaEnter } />
		)
	}
	
	const downloadTranscript = () => {
		let element = document.createElement('a')
		let filename = 'meetingBookmark' + Date.now()
		let content = ''

		for (let i = 0;i < transcript.length; i++) {
			content += transcript[i].timestamp + '\n' + transcript[i].text + '\n\n'
		}

		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
		element.setAttribute('download', filename)
		element.style.display = 'none'
		document.body.appendChild(element)
		element.click()
		document.body.removeChild(element)
	}

	return (
		<Container>
			<Header 
				left={ <i onClick={ () => setShowBookmarkList(false) } className="icon icon-Back" /> }
				right={ <i onClick={ () => downloadTranscript() } className="icon icon-DownloadDocument" /> }
				bookmarksExist={ true } /> 
			<Main>
				{ renderBookmarks() }
			</Main>
		</Container>
	)
}

export default BookmarkList

const Container = styled.div`
	text-align: center;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: black;
	color: white;
`

const Line = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	margin-bottom: 16px;
	height: fit-content;
	min-height: 30px;
`

const Content = styled.div`
	text-align: left;
	flex: 1;
	width: calc(100% - 30px);
	padding: 8px 16px;
`

const Timestamp = styled.div`
	font-size: 10px;
	opacity: 0.5;
`

const Text = styled.div`
	width: 100%;
`

const Bookmark = styled.div`
	width: 50px;
	height: 100%;
	font-size: 16px;
	display: flex;
	align-items: flex-start;
	justify-content: center;

	.icon {
		width: 100%;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.disabled {
		opacity: 0.5;
	}
`

const Main = styled.div`
	width: 100%;
	height: calc(100% - 50px);
	overflow-y: auto;
`

const TextField = styled.textarea`
	outline: none;
	width: 100%;
	background: rgba(255,255,255,0.3);
	font-family: 'Segoe UI', sans-serif;
	color: white;
	border: none;
	border-radius: 0;
	resize: none;
`