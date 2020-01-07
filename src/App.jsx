import React, { useContext } from 'react'

import GlobalContextProvider from './contexts/GlobalContext'
import Wrapper from './components/Wrapper'

const App = () => {
	return (
		<GlobalContextProvider>
			<Wrapper>
			</Wrapper>
		</GlobalContextProvider>
	);
}
 
export default App