import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import muAxios from "../../../lib/axios-config";

const deleteProject = createAsyncThunk(
    'deleteProject',
    async ({name, pageNumber, pageSize}, thunkApi) => {
        const response = await muAxios.post('/delete-project', {name});
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
            const {projects, count, pageNumber, perPage} = action.payload;
            state.projects = projects;
            state.count = count;
            state.pageNumber = pageNumber;
            state.pageSize = perPage;

        },
        setPagination: (state, action) => {
            state.count = action.payload.count ?? state.count;
            state.pageSize = action.payload.pageSize ?? state.pageSize;
            state.pageNumber = action.payload.pageNumber ?? state.pageNumber;
        },
        addProject: (state, action) => {
            state.projects.unshift(action.payload);
            state.count++
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteProject.fulfilled, (state, action) => {
            state.projects = action.payload.projects
            state.count = action.payload.count
        })
    }
});

export const {setProjects, setPagination, addProject} = projectsSlice.actions;
export {deleteProject};

export default projectsSlice.reducer;
