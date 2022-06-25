import Head from 'next/head'
import {Button, Container, Grid} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/Search";
import {AddCircleOutline} from "@mui/icons-material";
import {toast} from "react-toastify";
import Projects from "../components/Projects";
import CustomPagination from "../components/Pagination";

export async function getServerSideProps(context) {
    const accessToken = context.req.cookies.access_token
    if (!accessToken) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}

export default function Home() {

    const handleEdit = () => {
        console.log('edit')
        toast.success('تم الاضافة بنجاح')
    }

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
                        <Button fullWidth variant={'contained'} size={'large'}
                                startIcon={<AddCircleOutline/>} onClick={handleEdit}>إضافة</Button>
                    </Grid>
                    <Grid item xs={4}></Grid>

                    <Grid item xs={12}>
                        <Projects/>
                    </Grid>

                    <Grid item xs={12} my={4}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center">
                            <Grid item xs={12}>
                                <CustomPagination/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
