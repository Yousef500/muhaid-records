import {Grid, TextField} from "@mui/material";

const FirstStep = ({register}) => {
    return (
        <Grid container spacing={1} mt={3}>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'اسم المشروع'} {...register('projectName')} />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'عنوان المشروع'} {...register('projectAddress')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'الأمانة'} {...register('municipality')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'البلدية'} {...register('municipal')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'الحي'} {...register('district')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'اسم المالك'} {...register('ownerName')}/>
            </Grid>
        </Grid>
    )
}

export default FirstStep;