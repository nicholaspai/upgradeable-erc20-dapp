// List of all actions that can be dispatched to redux store
export const TYPES = {
	SET_GAS: "SET_GAS",
	SET_WEB3_LOADING: "SET_WEB3_LOADING",
	SET_VERIFIED_ADDRESS: "SET_VERIFIED_ADDRESS",
	SET_HOME: "SET_HOME",
	SET_LOGIN: "SET_LOGIN",
	SET_ADMIN: "SET_ADMIN",

}

export const actions = {
	setGas: gas => ({
		type: TYPES.SET_GAS,
		gas
	}),
	setWeb3Loading: bool => ({
		type: TYPES.SET_WEB3_LOADING,
		bool
	}),
	setVerifiedAddress: address => ({
		type: TYPES.SET_VERIFIED_ADDRESS,
		address
	}),
	setHome: bool => ({
		type: TYPES.SET_HOME,
		bool
	}),
	setLogin: bool => ({
		type: TYPES.SET_LOGIN,
		bool
	}),
	setAdmin: bool => ({
		type: TYPES.SET_ADMIN,
		bool
	}),
}

// Reset main component
export function resetMain() {
  return dispatch => {
    // Reset main component state transition machine 
    dispatch(actions.setHome(false));
    dispatch(actions.setLogin(false));
    dispatch(actions.setAdmin(false));
  };
}