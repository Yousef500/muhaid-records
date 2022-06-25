import {configureStore} from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import projectsReducer from './slices/projectsSlice';

// const reducers = combineReducers({
//     user: userReducer
// })

// const persistConfig = {
//     key: 'root',
//     storage
// }
//
// const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: {
        user: userReducer,
        projects: projectsReducer
    }
    // middleware: [thunk]
});

export default store;