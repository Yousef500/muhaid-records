import {Container, Grid, Paper, Typography} from "@mui/material";
import Center from "../../../components/Center";
import StageOne from "../../../components/StageOne";
import {connectToDatabase} from "../../../lib/mongodb";

export async function getServerSideProps(ctx) {
    const {id} = ctx.query;
    const {db} = await connectToDatabase();
    const projectVisits = await db
        .collection("ProjectVisits")
        .findOne({projectID: Number(id)});

    console.log(projectVisits);
    return {
        props: {
            visits: projectVisits.visits,
            projectID: id
        },
    };
}

const Visits = ({visits, projectID}) => {
    console.log(visits.stageOne);
    return (
        <Container maxWidth={false} sx={{py: 5}}>
            <Paper elevation={10} sx={{pt: 5}}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Center>
                            <Typography variant={"h3"}>الزيارات</Typography>
                        </Center>
                    </Grid>
                    <Grid item xs={12}>
                        <StageOne rows={visits.stageOne.majorSteps}/>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Visits;
