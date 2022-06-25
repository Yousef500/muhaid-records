import {createSlice} from "@reduxjs/toolkit";

export const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        count: 0,
        pageSize: 5,
        pageNumber: 1
    },
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setPagination: (state, action) => {
            state.count = action.payload.count ?? state.count;
            state.pageSize = action.payload.pageSize ?? state.pageSize;
            state.pageNumber = action.payload.pageNumber ?? state.pageNumber;
        }
    }
});

export const {setProjects, setPagination} = projectsSlice.actions;

export default projectsSlice.reducer;
