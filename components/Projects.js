import ProjectCard from "./ProjectCard";
import {Grid} from "@mui/material";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setPagination} from "../src/app/slices/projectsSlice";

const Projects = () => {
    const dispatch = useDispatch();
    const {pageSize, pageNumber, projects} = useSelector(state => state.projects);

    useEffect(() => {
        dispatch(setPagination({count: projects.length}))
    }, [dispatch, projects]);

    return (
        <Grid container spacing={{xs: 0, sm: 2}}>
            {
                projects.slice(((pageNumber - 1) * pageSize), (pageNumber * pageSize)).map((project, index) => (
                    <Grid key={index} item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <ProjectCard name={project.projectName} description={project.projectAddress}
                                     img={project.images[0]} id={index}/>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Projects;