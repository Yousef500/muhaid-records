import {
    TableRow,
    TableCell,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TableContainer,
    Table,
    TableHead,
    TableBody,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Center from "./Center";

const StageOne = ({rows}) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Center>
                    <Typography variant={"h5"}>المرحلة الأولى</Typography>
                </Center>
            </AccordionSummary>
            <AccordionDetails>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#E2EFD9" }}>
                            <TableRow>
                                <TableCell width={10}></TableCell>
                                <TableCell align="left">
                                    <Typography variant={"h5"}>
                                        قبل صب الأساسات
                                    </Typography>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                sx={{
                                    backgroundColor: "#FFC300",
                                }}
                            >
                                <TableCell>
                                    <Typography variant="h6">م</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        الإعداد
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">الحالة</Typography>
                                </TableCell>
                            </TableRow>
                            {rows.map((title, index) => (
                                <>
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{title}</TableCell>
                                        <TableCell>الحالة</TableCell>
                                    </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    );
};

export default StageOne;
