import React, { Component, createContext } from 'react'

export const GlobalContext = createContext()

class GlobalContextProvider extends Component {
	state = {
	}

	render() {
		return (
			<GlobalContext.Provider value={{ ...this.state }}>
				{this.props.children}
			</GlobalContext.Provider>
		)
	}
}

export default GlobalContextProvider