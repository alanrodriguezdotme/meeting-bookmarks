import React from 'react'

import GlobalContextProvider from './contexts/GlobalContext'
import Wrapper from './components/Wrapper'
import STTContextProvider from './contexts/STTContext'

const App = () => {
	return (
		<GlobalContextProvider>
			<STTContextProvider>
				<Wrapper />
			</STTContextProvider>
		</GlobalContextProvider>
	);
}
 
export default App