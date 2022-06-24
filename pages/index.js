import Head from 'next/head'
import {Box, Button, Container, Grid, IconButton, List, ListItem, ListItemText, Paper, Stack} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/Search";
import {AddCircleOutline, AddCircleOutlined, Delete, Download, Edit} from "@mui/icons-material";
import {toast} from "react-toastify";

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
                <link rel="icon" href="/favicon.ico"/>
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
                                <ListItemText>jbdfhbdfhbfjvglFBGHFBGB JBFJVGHABvgvgrhk eBFHLbسجل
                                    تجريبي</ListItemText>

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
