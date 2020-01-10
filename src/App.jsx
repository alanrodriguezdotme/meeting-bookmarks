import React from 'react'

import GlobalContextProvider from './contexts/GlobalContext'
import SpeechToTextContextProvider from './contexts/SpeechToTextContext'
import Wrapper from './components/Wrapper'

const App = () => {
	return (
		<GlobalContextProvider>
			<SpeechToTextContextProvider>
				<Wrapper />
			</SpeechToTextContextProvider>
		</GlobalContextProvider>
	);
}
 
export default App