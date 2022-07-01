import ProjectCard from "./ProjectCard";
import {Grid} from "@mui/material";
import {useSelector} from "react-redux";

const Projects = () => {
    const {pageSize, pageNumber, projects} = useSelector(state => state.projects);

    return (
        <Grid container spacing={{xs: 0, sm: 2}}>
            {
                projects.slice(((pageNumber - 1) * pageSize), (pageNumber * pageSize)).map((project) => (
                    <Grid key={project._id} item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <ProjectCard name={project.projectName} description={project.projectAddress}
                                     img={project.images[0]} id={project._id}/>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Projects;