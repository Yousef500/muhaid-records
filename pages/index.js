import Head from 'next/head'
import {Button, Container, Grid, IconButton, List, ListItem, ListItemText, Stack} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/Search";
import {AddCircleOutline, Delete, Download, Edit} from "@mui/icons-material";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setLoggedIn} from "../src/app/slices/userSlice";
import {useRouter} from "next/router";

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
    const loggedIn = useSelector(state => state.user.loggedIn)
    const dispatch = useDispatch();
    const router = useRouter()

    useEffect(() => {
        if (!loggedIn) {
            router.push('/sign-in');
        }
    }, [loggedIn, router.route])

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

            <Container>

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
                        <List>
                            <ListItem divider>
                                <ListItemText>سجل تجريبي</ListItemText>

                                <Stack direction={{xs: 'column', sm: 'row'}} spacing={1}>
                                    <IconButton color={'primary'}>
                                        <Download/>
                                    </IconButton>

                                    <IconButton color={'secondary'}>
                                        <Edit/>
                                    </IconButton>

                                    <IconButton color={'warning'}>
                                        <Delete/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
