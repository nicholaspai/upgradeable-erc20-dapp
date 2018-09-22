import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {
  general,
  main
} from "./reducers";

// Add all reducers here to aggregate into one store
const rootReducer = combineReducers({
  general,
  main,
});

// Import store from createStore() => store
export default createStore(rootReducer, {}, applyMiddleware(thunk, logger));
