import Head from 'next/head'
import {Button, Container, Grid, IconButton, List, ListItem, ListItemText, Paper, Stack} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/Search";
import {AddCircleOutline, AddCircleOutlined, Delete, Download, Edit} from "@mui/icons-material";

export default function Home() {

    const handleEdit = () => {
        console.log('edit')
    }

    return (
        <>
            <Head>
                <title>سجلَات المُحايد</title>
                <meta name="description" content="Al Muhaid Redocrds"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Navbar/>
            <Container sx={{mt: 10}}>
                <Grid container spacing={1} mx={'auto'}>
                    <Grid item xs={12}>
                        <SearchComponent/>
                    </Grid>

                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Button fullWidth variant={'contained'} startIcon={<AddCircleOutline/>}>إضافة</Button>
                    </Grid>
                    <Grid item xs={4}></Grid>

                    <Grid mt={2} item component={Paper} xs={12}>
                        <List>
                            <ListItem divider>
                                <ListItemText>سجل تجريبي</ListItemText>
                                <Stack direction={'row'} spacing={1}>
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
