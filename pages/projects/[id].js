import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";
import {useRouter} from "next/router";
import {Container, Grid, List, ListItem, ListItemButton, ListItemText, Paper} from "@mui/material";
import {useState} from "react";


export async function getStaticProps(ctx) {
    const {id} = ctx.params;

    const {db} = await connectToDatabase();
    const cursor = await db.collection("Projects").find({_id: Number(id)}, {"hint": "all_fields"});
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

// const drawerWidth = 240;

const ProjectDetails = ({project}) => {
    const router = useRouter();
    const [selected, setSelected] = useState(0)

    // if (router.isFallback) {
    //     return <Backdrop
    //         sx={{bgcolor: 'white', zIndex: (theme) => theme.zIndex.drawer + 1}}
    //         open={true}
    //     >
    //         <CircularProgress color="secondary" size={200}/>
    //     </Backdrop>
    // }
    // const window = () => Window;
    // const container = window !== undefined ? () => window().document?.body : undefined;
    // const [mobileOpen, setMobileOpen] = useState(false);
    // const handleDrawerToggle = () => {
    //     setMobileOpen(!mobileOpen);
    // };

    const handleSelected = (id) => {
        setSelected(id)
    }

    // const drawer = (
    //     <List>
    //         {['المعلومات الأساسية', 'معلومات البناء', 'معلومات المكتب'].map((text, index) => (
    //             <ListItem key={text} disablePadding>
    //                 <ListItemButton onClick={() => handleSelected(index)} selected={index === selected}>
    //                     <ListItemText primary={text}/>
    //                 </ListItemButton>
    //             </ListItem>
    //         ))}
    //     </List>
    // )
    return (
        <Container maxWidth={false} sx={{mb: 5, mt: 7, pl: {xs: 3, sm: 3, md: 3}}}>
            <Grid container>
                {/*<Grid item xs={2} mr={2} component={Paper}>*/}
                {/*    {*/}
                {/*        drawer*/}
                {/*    }*/}
                {/*    <IconButton*/}
                {/*        color="inherit"*/}
                {/*        aria-label="open drawer"*/}
                {/*        edge="start"*/}
                {/*        onClick={handleDrawerToggle}*/}
                {/*        sx={{mr: 2, display: {sm: 'none'}}}*/}
                {/*    >*/}
                {/*        <MenuIcon/>*/}
                {/*    </IconButton>*/}
                {/*    <Drawer*/}
                {/*        container={container}*/}
                {/*        variant="temporary"*/}
                {/*        open={mobileOpen}*/}
                {/*        onClose={handleDrawerToggle}*/}
                {/*        ModalProps={{*/}
                {/*            keepMounted: true, // Better open performance on mobile.*/}
                {/*        }}*/}
                {/*        sx={{*/}
                {/*            display: {xs: 'block', sm: 'none'},*/}
                {/*            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {drawer}*/}
                {/*    </Drawer>*/}
                {/*    <Drawer*/}
                {/*        variant="permanent"*/}
                {/*        sx={{*/}
                {/*            display: {xs: 'none', sm: 'block'},*/}
                {/*            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},*/}
                {/*        }}*/}
                {/*        open*/}
                {/*    >*/}
                {/*        {drawer}*/}
                {/*    </Drawer>*/}
                {/*</Grid>*/}

                <Grid item xs={} component={Paper}>
                    {project?.projectName}
                </Grid>
            </Grid>
        </Container>
    )
}

export default ProjectDetails