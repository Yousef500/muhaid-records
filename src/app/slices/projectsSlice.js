import {createSlice} from "@reduxjs/toolkit";
import muAxios from "../../../lib/axios-config";
import {toast} from "react-toastify";

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
        deleteProject: async (state, action) => {
            const projectName = action.payload;
            try {
                const response = await muAxios.post('/delete-project', {projectName});
                // state.projects = state.projects.filter((proj, id) => id !== action.payload)
                console.log(state.projects)
                const {data} = await muAxios.get(`/fetch-projects?currentPage${state.pageNumber}&pageSize=${state.pageSize}`);
                state.projects = data.projects;
                console.log(state.projects)
                toast.success('تم حذف المشروع بنجاح')
            } catch (e) {
                toast.error(e.response.data.message ?? 'لقد حدث خطأ ما')
            }
        }
    }
});

export const {setProjects, setPagination, addProject, deleteProject} = projectsSlice.actions;

export default projectsSlice.reducer;
