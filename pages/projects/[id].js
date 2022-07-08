import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";
import {useRouter} from "next/router";
import {Card, CardHeader, CardMedia, Container, Grid, Typography, CardContent, List} from "@mui/material";
import Carousel from 'react-material-ui-carousel'
import {ArrowLeft, ArrowRight} from "@mui/icons-material";


export async function getStaticProps(ctx) {
    const {id} = ctx.params;

    const {db} = await connectToDatabase();
    const cursor = await db.collection("Projects").find({_id: Number(id)}, {"hint": "all_fields"});
    const project = (await cursor.toArray())[0]
    const images = [];
    for (let imageObject of project.images) {
        const image = await fs.promises.readFile(imageObject.src, 'base64');
        images.push({
            ...imageObject,
            src: `data:${imageObject.type};base64,${image}`
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

// const drawerWidth = 240;

const ProjectDetails = ({project}) => {
    const router = useRouter();

    return (
        <Container maxWidth={false} sx={{mb: 5, mt: 7, pl: {xs: 3, sm: 3, md: 3}}}>
            <Grid container>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title={
                                <Grid container alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant={'h3'}>{project?.projectName}</Typography>
                                </Grid>
                            }
                        />
                        <Carousel
                            sx={{marginTop: {xs: 5, lg: 10}, marginX: {xs: 0, lg: 13}, px: {xs: 0, lg: 10}}}
                            NextIcon={<ArrowLeft sx={{fontSize: 40}}/>}
                            PrevIcon={<ArrowRight sx={{fontSize: 40}}/>}
                            width={'70rem'}
                            height={'40rem'}
                            // NavButtonsProps={{
                            //     style: {
                            //         color: 'black'
                            //     }
                            // }}
                            // navButtonsWrapperProps={{
                            //     style: {
                            //         background: 'black',
                            //         height: '50rem',
                            //         opacity: 0.2
                            //     }
                            // }}
                            navButtonsAlwaysVisible={true}
                        >
                            {project?.images?.map((image, i) => (
                                <CardMedia
                                    key={i}
                                    component={'img'}
                                    image={image.src}
                                    width={'70rem'}
                                    height={'100%'}
                                    alt={image.name}
                                />
                            ))}
                        </Carousel>
                        <CardContent>
                            <List></List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

export default ProjectDetails
