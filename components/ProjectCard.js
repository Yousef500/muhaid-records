import {Button, Card, CardActions, CardContent, CardMedia, Divider, Grid, Typography} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {deleteProject} from "../src/app/slices/projectsSlice";

const ProjectCard = ({name, description, img, id}) => {
    const dispatch = useDispatch();
    const handleDownload = () => {
        try {
            const aTag = document.createElement("a");
            aTag.href = `/api/testcreatepdf?name=${name}&description=${description}`;
            aTag.target = '_blank';
            document.body.appendChild(aTag);
            aTag.click();
            document.body.removeChild(aTag);
        } catch (e) {
            toast.error('لقد حدث خطأ ما')
        }
    }

    const handleDelete = () => {
        dispatch(deleteProject(id))
    }

    return (
        <Card sx={{my: 2}} elevation={6}>
            <CardMedia component={'img'} height={'290'} image={img ?? '/static/images/High-res.jpg'}/>
            <Divider/>
            <CardContent sx={{height: 180, overflowY: 'auto'}}>
                <Typography gutterBottom variant={'h5'} component={'div'}>{name}</Typography>
                <Typography variant={'body1'} color={'text.primary'}>{description}</Typography>
            </CardContent>
            <CardActions sx={{my: 2}}>
                <Grid spacing={1} container alignItems={'center'} justifyContent={'center'}>
                    <Button sx={{borderRadius: '1rem'}} startIcon={<FileDownloadOutlinedIcon/>} variant={'contained'}
                            color={"primary"}
                            onClick={handleDownload}>استخراج</Button>
                    <Button sx={{mx: 1, borderRadius: '1rem'}} startIcon={<Edit/>} variant={'outlined'}
                            color={"secondary"}>تعديل</Button>
                    <Button sx={{borderRadius: '1rem'}} startIcon={<Delete/>} color={"error"} onClick={handleDelete}
                            label={'حذف'}>حذف</Button>
                </Grid>
            </CardActions>
        </Card>
    )
}

export default ProjectCard