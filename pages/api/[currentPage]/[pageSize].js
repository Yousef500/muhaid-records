import Navbar from "../../../components/Navbar";
import Head from "next/head";
import {Button, Container, Grid} from "@mui/material";
import SearchComponent from "../../../components/Search";
import Link from "next/link";
import {AddCircleOutline} from "@mui/icons-material";
import Projects from "../../../components/Projects";
import CustomPagination from "../../../components/Pagination";
import {connectToDatabase} from "../../../lib/mongodb";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setProjects} from "../../../src/app/slices/projectsSlice";


export async function getServerSideProps(ctx) {
    console.log(ctx.query)
    const {currentPage, pageSize} = ctx.req.query;
    const skipParams = (Number(currentPage) - 1) * Number(pageSize);
    const {db} = await connectToDatabase();
    const cursor = await db.collection('Projects').find({}, {skip: skipParams, limit: Number(pageSize)});
    const projects = await cursor.toArray()
    console.log('projects', projects)
    return {
        props: {
            projects
        }
    }
}

// export async function getStaticPaths() {
//     return {
//         paths: [],
//         fallback: true
//     }
// }

const ProjectsPage = ({projects}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (projects) {
            dispatch(setProjects(projects))
        }
    }, [])

    return (
        <>
            <Navbar/>
            <Head>
                <title>سجلَات المُحايد</title>
                <meta name="description" content="Al Muhaid Redocrds"/>
                <link rel="icon" href="/mceicon.png"/>
            </Head>

            <Container maxWidth={'fluid'}>

                <Grid container
                      alignItems="center"
                      justifyContent="center" spacing={{xs: 1, sm: 2}} m={'auto'}>
                    <Grid item xs={12}>
                        <SearchComponent/>
                    </Grid>

                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Link href={'/add-project'}>
                            <Button fullWidth variant={'contained'} size={'large'}
                                    startIcon={<AddCircleOutline/>}>إضافة مشروع</Button>
                        </Link>
                    </Grid>
                    <Grid item xs={4}></Grid>

                    <Grid item xs={12}>
                        <Projects/>
                    </Grid>

                    <Grid item xs={12} my={4}>
                        <CustomPagination/>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default ProjectsPage