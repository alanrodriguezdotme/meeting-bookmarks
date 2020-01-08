import React, { useContext } from 'react'

import GlobalContextProvider from './contexts/GlobalContext'
import Wrapper from './components/Wrapper'
import SpeechToTextContext from './contexts/SpeechToTextContext';

const App = () => {
	return (
		<GlobalContextProvider>
			<SpeechToTextContext>
				<Wrapper>
				</Wrapper>
			</SpeechToTextContext>
		</GlobalContextProvider>
	);
}
 
export default App