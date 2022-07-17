import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Center from "./Center";
import { Fragment } from "react";

const StageOne = ({ rows }) => {
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
                <TableCell align="left" colSpan={3}>
                  <Typography variant={"h5"}>قبل صب الأساسات</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Fragment key={row.name}>
                  <TableRow
                    sx={{
                      backgroundColor: "#FFC300",
                    }}
                  >
                    <TableCell>
                      <Typography variant="h6">م</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">{row.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">الحالة</Typography>
                    </TableCell>
                  </TableRow>

                  {row.steps.map((step, index) => (
                    <TableRow key={step.name}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{step.name}</TableCell>
                      <TableCell>الحالة</TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default StageOne;
