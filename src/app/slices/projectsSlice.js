import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import muAxios from "../../../lib/axios-config";

const postDeleteProject = createAsyncThunk(
    'fetchProjects',
    async ({pageNumber, pageSize}, thunkApi) => {
        const {data} = await muAxios.get(`/fetch-projects?currentPage=${pageNumber}&pageSize=${pageSize}`);
        return data;
    }
)

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
            const {projects, count} = action.payload;
            state.projects = projects
            state.count = count;

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
        deleteProject: async (state, action) => {
            state.projects = state.projects.filter(p => p.projectName !== action.payload);
            state.count--
        }
    },
    extraReducers: (builder) => {
        builder.addCase(postDeleteProject.fulfilled, (state, action) => {
            state.projects = action.payload.projects
            state.count = action.payload.count
        })
    }
});

export const {setProjects, setPagination, addProject, deleteProject} = projectsSlice.actions;
export {postDeleteProject};

export default projectsSlice.reducer;
