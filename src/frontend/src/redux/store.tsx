// See the following guides for an explanation:
// https://redux-starter-kit.js.org/usage/usage-guide
// https://redux.js.org/recipes/usage-with-typescript
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { searchReducer } from "./search/reducer";
import demoReducer from "./demoSlice";

const rootReducer = combineReducers({
  search: searchReducer,
  demo: demoReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
