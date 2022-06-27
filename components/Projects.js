import ProjectCard from "./ProjectCard";
import {Grid} from "@mui/material";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPagination} from "../src/app/slices/projectsSlice";

const Projects = () => {
    const dispatch = useDispatch();
    const {pageSize, pageNumber, projects} = useSelector(state => state.projects);

//     const initialProjects = [...Array(15).keys()].map((number) => ({
//         projectName: `مشروع ${number + 1}`,
//         projectAddress: `لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد. لقد كان Lorem Ipsum هو
// النص الوهمي القياسي في الصناعة منذ القرن الخامس عشر الميلادي ، عندما أخذت طابعة غير معروفة لوحًا من النوع و
// . شفرها لعمل كتاب عينة من النوع.`
//     }))

    useEffect(() => {
        // dispatch(setProjects([projects, ...initialProjects]))
        dispatch(setPagination({count: projects.length}))
    }, [projects]);

    return (
        <Grid container spacing={2}>
            {
                projects.slice(((pageNumber - 1) * pageSize), (pageNumber * pageSize)).map((project, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4} xl={3}>
                        <ProjectCard name={project.projectName} description={project.projectAddress}
                                     img={project.images[0]} id={index}/>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Projects;