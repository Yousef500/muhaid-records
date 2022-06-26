import {Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography} from "@mui/material";
import {Delete, Download, Edit} from "@mui/icons-material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {toast} from "react-toastify";

const ProjectCard = ({name, description}) => {
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

    return (
        <Card elevation={6} sx={{my: 2}}>
            <CardMedia component={'img'} image={'/static/images/High-res.jpg'}/>
            <CardContent>
                <Typography gutterBottom variant={'h5'} component={'div'}>{name}</Typography>
                <Typography variant={'body1'} color={'text.primary'}>{description}</Typography>
            </CardContent>
            <CardActions sx={{mb: 2}}>
                <Chip icon={<FileDownloadOutlinedIcon/>} color={"primary"} onClick={handleDownload}
                      label={'استخراج'}/>
                <Chip icon={<Edit/>} color={"secondary"} label={'تعديل'}/>
                <Chip icon={<Delete/>} color={"error"} label={'حذف'}/>
            </CardActions>
        </Card>
    )
}

export default ProjectCard