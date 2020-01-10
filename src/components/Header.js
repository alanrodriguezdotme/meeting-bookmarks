import React, { useContext } from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../contexts/GlobalContext'

const Header = ({ left, middle, right, bookmarksExist }) => {
	let { transcript } = useContext(GlobalContext)

	return (
		<Container>
			<Left>{ left && left }</Left>
			<Middle>{ middle && middle }</Middle>
			<Right>{ right && bookmarksExist && right }</Right>
		</Container>
	)
}

export default Header

const Container = styled.div`
	text-align: center;
	height: 50px;
	display: flex;
	font-size: 16px;

	.icon {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`

const Left = styled.div`
	width: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Middle = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Right = styled.div`
	width: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
`