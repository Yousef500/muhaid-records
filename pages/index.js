import Head from 'next/head'
import {Button, Container, Grid, IconButton, List, ListItem, ListItemText, Stack} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/Search";
import {AddCircleOutline, Delete, Download, Edit} from "@mui/icons-material";
import {toast} from "react-toastify";
import muAxios from "../lib/axios-config";
const FileSaver = require('file-saver');

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

    const handleDownload = () => {
        try {
            const {data} = muAxios.get('/testcreatepdf');
            const blob = new Blob([data], {type: 'application/pdf'});
            FileSaver.saveAs(blob, 'test.pdf')
            toast.success('done')
        } catch (e) {
            console.log(e)
            toast.error('wrong')
        }
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
                                    <IconButton color={'primary'} onClick={handleDownload}>
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
