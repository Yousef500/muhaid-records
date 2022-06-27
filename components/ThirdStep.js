import {Grid, TextField} from "@mui/material";

const ThirdStep = ({register}) => {
    return (
        <Grid container spacing={1} mt={3}>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'مكتب المصمم المعتمد'} {...register('desOffice')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'المكتب الهندسي المشرف'} {...register('superOffice')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'مقاول البناء'} {...register('contractor')}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField fullWidth label={'اسم المهندس المشرف'} {...register('superEng')}/>
            </Grid>
        </Grid>
    )
}

export default ThirdStep;