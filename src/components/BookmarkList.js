import React, { useState, useContext, useEffect } from 'react'
import * as _ from 'underscore'
import styled from 'styled-components'

import { GlobalContext } from '../contexts/GlobalContext'
import Header from './Header'

const BookmarkList = () => {
	let [ bookmarks, setBookmarks ] = useState(null)
	let { transcript, setShowBookmarkList } = useContext(GlobalContext)

	// useEffect(() => {
	// 	setBookmarks(_.where(transcript, { bookmark: true }))
	// }, [])

	const renderBookmarks = () => {
		// if (bookmarks) {
			return transcript.map((line, index) => {
				if (line.bookmark) {
					return (
						<Line key={ 'bookmarkLine' + index }>
							<Text>{ line.text }</Text>
							<Bookmark onClick={ () => handleLineBookmarkClick(index) }>
								<i className={ line.bookmark ? "icon icon-SingleBookmarkSolid" : "icon icon-AddBookmark disabled" } />
							</Bookmark>
						</Line>
					)
				}
			})
		// }
	}

	return (
		<Container>
			<Header left={<i onClick={ () => setShowBookmarkList(false) } className="icon icon-Back" />} />
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

const Text = styled.div`
	text-align: left;
	flex: 1;
	width: calc(100% - 30px);
	padding: 8px 16px;
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