import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Divider,
    Grid,
    Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "@mui/material";
import Center from "../../../components/Center";
import {ExpandMore} from "@mui/icons-material";


const Visits = () => {
    return (
        <Container maxWidth={false} sx={{padding: 10}}>
            <Paper elevation={10}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Center>
                            <Typography variant={'h3'}>
                                الزيارات
                            </Typography>
                        </Center>
                    </Grid>
                    <Grid item xs={12}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                            >
                                <Center>
                                    <Typography variant={'h5'}>
                                        المرحلة الأولى
                                    </Typography>
                                </Center>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableHead sx={{backgroundColor: '#E2EFD9'}}>
                                        <TableRow>
                                            <TableCell>
                                                <Center>
                                                    <Typography variant={'h5'}>
                                                        قبل صب الأساسات
                                                    </Typography>
                                                </Center>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                1
                                            </TableCell>
                                            <TableCell>
                                                <TableRow>
                                                    <TableCell>
                                                        الإعداد
                                                    </TableCell>
                                                    <TableCell>
                                                        الحالة
                                                    </TableCell>
                                                </TableRow>
                                            </TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default Visits;