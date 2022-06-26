import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";

const AddProject = ({open, setOpen}) => {

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} fullScreen>
            <Grid container spacing={1} padding={{xs: 0, sm: 5, md: 10}}>
                <Grid item xs={12}>
                    <Grid container spacing={0} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                        <DialogTitle>
                            <Typography variant={'h3'}>
                                إضافة مشروع
                            </Typography>
                        </DialogTitle>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label={'اسم المشروع'}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label={'الامانة'}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Grid>
                <Grid item xs={12} mx={2}>
                    <DialogActions>
                        <Button fullWidth endIcon={<Save/>} onClick={handleClose} variant={'contained'}
                                color={'success'}>حفظ</Button>
                        <Button fullWidth endIcon={<Cancel/>} onClick={handleClose} variant={'outlined'}
                                color={'warning'}>إلغاء</Button>
                    </DialogActions>
                </Grid>
            </Grid>
        </Dialog>
    )
}

export default AddProject