import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import {Delete, Edit, MoreHoriz, Save} from "@mui/icons-material";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {deleteProject} from "../src/app/slices/projectsSlice";
import {useState} from "react";
import {LoadingButton} from "@mui/lab";
import Link from "next/link";

const ProjectCard = ({name, description, img, id}) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState();
    const menuOpen = Boolean(anchorEl)
    const {pageNumber, pageSize} = useSelector(state => state.projects)

    const handleDownload = async () => {
        try {
            const aTag = document.createElement("a");
            aTag.href = `/api/first-report?id=${id}`;
            aTag.download = `تقرير ${name}`
            document.body.appendChild(aTag);
            aTag.click();
            document.body.removeChild(aTag);
            // const res = await muAxios.post('/first-report', {
            //     data: data.project
            // })
        } catch (e) {
            toast.error('لقد حدث خطأ ما')
        }
    }

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            await dispatch(deleteProject({id, pageNumber, pageSize}))
            toast.success('تم حذف المشروع بنجاح')
            handleClose();
        } catch (e) {
            console.log({e})
            toast.error(e.response?.data?.message ?? 'لقد حدث خطأ ما')
            setLoading(false)
        }
        setLoading(false)

    }
    return (
        <>
            <Card sx={{my: 2}} elevation={6}>
                <CardHeader action={
                    <IconButton onClick={handleMenuOpen}>
                        <MoreHoriz/>
                    </IconButton>
                }
                />
                <Menu
                    open={menuOpen}
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Link href={`/projects/${id}/visits`}>
                        <MenuItem onClick={handleMenuClose}>
                            الزيارات
                        </MenuItem>
                    </Link>
                </Menu>
                <Link href={`/projects/${id}`}>
                    <CardMedia sx={{"&:hover": {cursor: 'pointer'}}} component={'img'}
                               src={img.src ?? '/static/images/Best.jpg'} height={320} width={500}
                               alt={'project-image'}/>
                </Link>
                <Divider/>
                <CardContent sx={{height: 180, overflowY: 'auto'}}>
                    <Typography gutterBottom variant={'h5'} component={'div'}>{name}</Typography>
                    <Typography variant={'body1'} color={'text.primary'}>{description}</Typography>
                </CardContent>
                <CardActions sx={{my: 2}}>
                    <Grid spacing={1} container alignItems={'center'} justifyContent={'center'}>
                        <Button sx={{borderRadius: '1rem'}} startIcon={<FileDownloadOutlinedIcon/>}
                                variant={'contained'}
                                color={"primary"}
                                onClick={handleDownload}>استخراج</Button>
                        <Link href={`/projects/edit-project/${id}`}>
                            <Button sx={{mx: 1, borderRadius: '1rem'}} startIcon={<Edit/>} variant={'outlined'}
                                    color={"secondary"}>
                                تعديل
                            </Button>
                        </Link>
                        <Button sx={{borderRadius: '1rem'}} startIcon={<Delete/>} color={"error"} onClick={handleOpen}
                                label={'حذف'}>حذف</Button>
                    </Grid>
                </CardActions>
            </Card>
            {
                open && (
                    <Dialog open={open} onClose={handleClose}>
                        <Grid container spacing={2} mb={2} padding={2}>
                            <Grid item xs={12}>
                                <DialogTitle>
                                    <Grid container alignItems={'center'} justifyContent={'center'}>
                                        هل أنت متأكد من حذف {name}؟
                                    </Grid>
                                </DialogTitle>
                            </Grid>
                            <Grid item xs={12}>
                                <DialogActions sx={{width: '100%'}}>
                                    <Grid container alignItems={'center'} justifyContent={'center'}>
                                        <Stack width={'100%'} direction={'row'} justifyContent={'space-evenly'}
                                               alignItems={'center'}
                                               spacing={1}>
                                            <LoadingButton loading={loading} sx={{borderRadius: '1rem'}} color={'error'}
                                                           variant={'outlined'}
                                                           fullWidth
                                                           startIcon={<Delete/>} onClick={handleDelete}>نعم</LoadingButton>
                                            <Button sx={{borderRadius: '1rem'}} color={'secondary'} fullWidth
                                                    variant={'contained'} startIcon={<Save/>} onClick={handleClose}
                                            >
                                                لا
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </DialogActions>
                            </Grid>
                        </Grid>
                    </Dialog>
                )
            }
        </>
    )
}

export default ProjectCard