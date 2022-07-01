import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import projectsReducer from './slices/projectsSlice';

const reducers = combineReducers({
    user: userReducer,
    projects: projectsReducer
})

// const persistConfig = {
//     key: 'root',
//     storage
// }
//
// const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: reducers,
});

export default store;