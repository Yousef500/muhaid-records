import ProjectCard from "./ProjectCard";
import {Grid} from "@mui/material";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPagination} from "../src/app/slices/projectsSlice";

const Projects = () => {
    const dispatch = useDispatch();
    const {pageSize, pageNumber} = useSelector(state => state.projects);

    const projects = [...Array(20).keys()].map((number) => ({
        name: `مشروع ${number + 1}`,
        description: `لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد. لقد كان Lorem Ipsum هو
النص الوهمي القياسي في الصناعة منذ القرن الخامس عشر الميلادي ، عندما أخذت طابعة غير معروفة لوحًا من النوع و
. شفرها لعمل كتاب عينة من النوع.`
    }))

    useEffect(() => {
        dispatch(setPagination({count: projects.length}))
    }, [dispatch, projects.length]);

    return (
        <Grid container spacing={2}>
            {
                projects.slice(((pageNumber - 1) * pageSize), (pageNumber * pageSize)).map((project, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} xl={3}>
                        <ProjectCard name={project.name} description={project.description}/>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Projects;