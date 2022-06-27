import {Card, CardActions, CardContent, CardMedia, Chip, Divider, Grid, Typography} from "@mui/material";
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
                    <Chip icon={<FileDownloadOutlinedIcon/>} color={"primary"} onClick={handleDownload}
                          label={'استخراج'}/>
                    <Chip sx={{mx: 1}} icon={<Edit/>} color={"secondary"} label={'تعديل'}/>
                    <Chip icon={<Delete/>} color={"error"} onClick={handleDelete} label={'حذف'}/>
                </Grid>
            </CardActions>
        </Card>
    )
}

export default ProjectCard