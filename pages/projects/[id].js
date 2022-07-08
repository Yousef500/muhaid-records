import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";
import {useRouter} from "next/router";
import {Container, Grid, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {List} from "@mui/icons-material";

export async function getStaticProps(ctx) {
    const {id} = ctx.params;

    const {db} = await connectToDatabase();
    const cursor = await db.collection("Projects").find({_id: Number(id)}, {"hint": "all_fields"}).project({mainImage: -1});
    const project = (await cursor.toArray())[0]
    console.log(project)
    const images = [];
    for (let imageObject of project.images) {
        const src = await fs.promises.readFile(imageObject.src, 'base64');
        images.push({
            ...imageObject,
            src: src
        })
    }

    return {
        props: {
            project: {...project, images: images}
        }
    }
}

export async function getStaticPaths() {
    const {db} = await connectToDatabase()
    const cursor = await db.collection("Projects").find({}, {"hint": "_id_"}).project({_id: 1});
    const ids = await cursor.toArray();
    const paths = [];
    for (let projectId of ids) {
        paths.push({params: {id: projectId.toString()}});
    }

    return {
        paths,
        fallback: true
    }
}


const ProjectDetails = ({project}) => {
    const router = useRouter();

    // if (router.isFallback) {
    //     return <Backdrop
    //         sx={{bgcolor: 'white', zIndex: (theme) => theme.zIndex.drawer + 1}}
    //         open={true}
    //     >
    //         <CircularProgress color="secondary" size={200}/>
    //     </Backdrop>
    // }

    return (
        <Container maxWidth={false}>
            <Grid container>
                <Grid item xs={5}>
                    <List>
                        {['المعلومات الأساسية', 'معلومات البناء', 'معلومات المكتب'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemText primary={text}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ProjectDetails