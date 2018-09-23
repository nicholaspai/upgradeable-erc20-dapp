import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Wallet from './Wallet'
import registerServiceWorker from './registerServiceWorker';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { red, blue, blueGrey } from "@material-ui/core/colors";

// Redux
import { Provider } from "react-redux";
import store from "./store/store";

// Web3 Provider
import Web3Provider from 'react-web3-provider'

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blueGrey,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  }
});
const defaultProvider = window.web3 ? window.web3.currentProvider : null

ReactDOM.render(
	<Web3Provider
		defaultWeb3Provider={defaultProvider}
		loading="Loading Ethereum data... We suggest that you install and log into MetaMask before running this application"
		error={(err) => `Connection error: ${err.message}`}
	>
		<Provider
			store={store}
			theme={{
		        fonts: { sans: "averta-regular, sans-serif" },
		        fontSizes: [12, 16, 24, 36, 48, 72]
		    }}
		>
			<MuiThemeProvider theme={theme}>
				<Wallet />
			</MuiThemeProvider>
		</Provider>
	</Web3Provider>, document.getElementById('root'));
registerServiceWorker();
