import { TYPES } from './actions'

// Initial State
export const initialState = {
	general: {
		gas: 25,
		web3Loading: false,
		verifiedAddress: "",
		balance: 0,
		transactions: [],
	},
	main: {
		home: true,
		login: false,
		admin: false,
	}
}

// Reducers that modify the settings in the redux store
export const general = (state = initialState.general, action) => {
	switch (action.type) {
		case TYPES.SET_GAS:
			return Object.assign({}, state, {
				gas: action.gas
			})
		case TYPES.SET_WEB3_LOADING:
			return Object.assign({}, state, {
				web3Loading: action.bool
			})
		case TYPES.SET_VERIFIED_ADDRESS:
			return Object.assign({}, state, {
				verifiedAddress: action.address
			})
		case TYPES.SET_BALANCE:
			return Object.assign({}, state, {
				balance: action.balance
			})
		case TYPES.ADD_TRANSACTION:
			return { ...state, transactions: [ ...state.transactions, action.transaction ] };
		default:
			return state
	}
}

// Reducers that modify the main component rendered
export const main = (state = initialState.main, action) => {
	switch (action.type) {
		case TYPES.SET_HOME:
			return Object.assign({}, state, {
				home: action.bool
			})
		case TYPES.SET_LOGIN:
			return Object.assign({}, state, {
				login: action.bool
			})
		case TYPES.SET_ADMIN:
			return Object.assign({}, state, {
				admin: action.bool
			})
		default:
			return state
	}
}