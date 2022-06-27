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
            state.count = action.payload.count ?? state.projects.length;
            state.pageSize = action.payload.pageSize ?? state.pageSize;
            state.pageNumber = action.payload.pageNumber ?? state.pageNumber;
        },
        addProject: (state, action) => {
            state.projects.unshift(action.payload);
            state.count++
        },
        deleteProject: (state, action) => {
            state.projects = state.projects.filter((proj, id) => id !== action.payload)
        }
    }
});

export const {setProjects, setPagination, addProject, deleteProject} = projectsSlice.actions;

export default projectsSlice.reducer;
