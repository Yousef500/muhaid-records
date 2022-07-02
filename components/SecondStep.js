import {Grid, TextField} from "@mui/material";

const SecondStep = ({register, step}) => {
    return (
        <Grid container spacing={1} mt={3} display={step !== 1 && 'none'}>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'رقم رخصة البناء'} {...register('permitNumber')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'رقم قطعة الأرض'} {...register('plotNumber')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'رقم المخطط'} {...register('schemeNumber')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'نوع البناء'} {...register('conType')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'وصف البناء'} {...register('conDesc')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'عدد الأدوار'} {...register('floorCount')}/>
            </Grid>
        </Grid>
    )
}

export default SecondStep;