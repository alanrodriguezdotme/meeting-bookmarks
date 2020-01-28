import React, { useState, useContext, useEffect } from 'react'
import * as _ from 'underscore'
import styled from 'styled-components'
// import emailjs from 'emailjs-com'

import { GlobalContext } from '../contexts/GlobalContext'
import Header from './Header'

const BookmarkList = () => {
	let { transcript, setShowBookmarkList, setTranscript } = useContext(GlobalContext)
	let [ textToEdit, setTextToEdit ] = useState('')
	let [ indexToEdit, setIndexToEdit ] = useState(null)
	let [ textArea, setTextArea ] = useState(React.createRef())
	let [ emailInputRef, setEmailInputRef ] = useState(React.createRef())
	let [ showEmailForm, setShowEmailForm ] = useState(false)
	let [ emailValue, setEmailValue ] = useState('')
	let [ emailSent, setEmailSent ] = useState(false)
	let [ isSending, setIsSending ] = useState(false)
	let [ postEmailMessage, setPostEmailMessage ] = useState(null)

	useEffect(() => {
		if (indexToEdit != null && textArea) {
			textArea.current.focus()
			textArea.current.setSelectionRange(textToEdit.length, textToEdit.length)
		}
	}, [indexToEdit])

	useEffect(() => {
		if (showEmailForm) {			
			emailInputRef.current.focus()
		}
	}, [showEmailForm])

	const getDate = () => {
		let date = new Date()
		return date.toDateString()
	}

	const sendEmail = () => {
		setIsSending(true)
		let content = createContent()
		let template_params = {
			"recepientEmail": emailValue,
			"date": getDate(),
			"content": content
		}
		window.emailjs.send('default_service','meetingbookmark', template_params)
			.then(res => {
				console.log(res)
				setEmailSent(true)
				setPostEmailMessage("Message sent. Please check your junk/spam folder if you don't see it.")
				setIsSending(false)
			})
			.catch(err => {
				setEmailSent(true)
				setPostEmailMessage("Sorry, something went wrong. Please try again later.")
				console.error(err)
			})
	}
	
	const createContent = () => {
		let content = ''

		for (let i = 0;i < transcript.length; i++) {
			content += '<p><small>' + transcript[i].timestamp + '</small><br />' + transcript[i].text + '</p>'
		}

		return content
	}

	const renderEmailForm = () => {
		return (
			<EmailFormWrapper>
				<Overlay onClick={() => setShowEmailForm(false)} />
				{ emailSent && postEmailMessage ? 
					renderPostEmailMessage() 
					:
					<EmailForm>
						<div className="title">Email transcript</div>
						<div className="emailFormRow">
							<input className="emailInput"
								ref={ emailInputRef }
								type="email" 
								value={emailValue}
								placeholder="Email"
								onChange={ (event) => setEmailValue(event.target.value)} />
							{ isSending ? 
								<div className="emailFormButton">
									<img src="assets/loading-small.gif" />
								</div>							
								:
								<div className="emailFormButton" 
									onClick={ () => sendEmail() }>
									<i className="icon icon-Send" />
								</div>							
							}
						</div>
					</EmailForm>

				}
			</EmailFormWrapper>
		)
	}

	const renderPostEmailMessage = () => {
		return (
			<EmailForm>
				<div className="title">{ postEmailMessage }</div>
				<div className="emailFormRow">
					<div className="emailFormButton"
						onClick={ () => {
							setEmailSent(false)
							setShowEmailForm(false)
						}}>Close</div>
				</div>
			</EmailForm>
		)
	}

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

	const handleEmailIconClick = () => {
		setShowEmailForm(true) 

	}

	return (
		<Container>
			<Header 
				left={ <i onClick={ () => setShowBookmarkList(false) } className="icon icon-Back" /> }
				right={ <i 
					onClick={ () => handleEmailIconClick() } 
					className="icon icon-Email" /> }
				bookmarksExist={ true } /> 
			<Main>
				{ showEmailForm && renderEmailForm() }
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

const EmailFormWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 10000;
	transform: translateX(100vw);
	display: flex;
	align-items: center;
	justify-content: center;
`

const Overlay = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	z-index: 1;
`

const EmailForm = styled.div`
	width: 80%;
	max-width: 300px;
	padding: 12px;
	display: flex;
	flex-direction: column;
	background: #333;
	box-shadow: 0 0 3px rgba(0,0,0,0.9);
	z-index: 2;

	.title {
		width: 100%;
		margin-bottom: 12px;
	}

	.emailFormRow {
		display: flex;
		align-items: center;
		width: 100%;
		margin-bottom: 4px;
		justify-content: center;
	}

	.emailInput {
		border: none;
		padding: 8px;
		border-radius: 0;
		font-family: 'Segoe UI', sans-serif;
		font-size: 14px;
		width: 100%;
		height: 35px;
		flex: 1;
		margin-right: 4px;
		outline: none;
	}

	.emailFormButton {
		background: white;
		color: black;
		padding: 8px;
		width: fit-content;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`
