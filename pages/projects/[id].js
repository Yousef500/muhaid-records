import {connectToDatabase} from "../../lib/mongodb";
import fs from "fs";
import {useRouter} from "next/router";
import {
    Backdrop,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    Paper,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import {
    ArrowLeft,
    ArrowRight,
    Delete,
    DeleteOutlined,
    EditOutlined,
    FileDownloadOutlined,
    HomeOutlined,
    Save,
} from "@mui/icons-material";
import Link from "next/link";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {toast} from "react-toastify";
import muAxios from "../../lib/axios-config";

export async function getStaticProps(ctx) {
    const {id} = ctx.params;

    const {db} = await connectToDatabase();
    const cursor = await db
        .collection("Projects")
        .find({_id: Number(id)}, {hint: "all_fields"});
    const project = (await cursor.toArray())[0];
    const images = [];
    for (let imageObject of project.images) {
        const image = await fs.promises.readFile(imageObject.src, "base64");
        images.push({
            ...imageObject,
            src: `data:${imageObject.type};base64,${image}`,
        });
    }

    return {
        props: {
            project: {...project, images: images},
        },
    };
}

export async function getStaticPaths() {
    const {db} = await connectToDatabase();
    const cursor = await db
        .collection("Projects")
        .find({}, {hint: "_id_"})
        .project({_id: 1});
    const ids = await cursor.toArray();
    const paths = [];
    for (let projectId of ids) {
        paths.push({params: {id: projectId._id.toString()}});
    }

    return {
        paths,
        fallback: true,
    };
}

// const drawerWidth = 240;

const ProjectDetails = ({project}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {_id, images, mainImage, ...proj} = project ?? {};
    const table = [
        {head: "اسم المشروع :", data: proj?.projectName},
        {head: "عنوان المشروع :", data: proj?.projectAddress},
        {head: "الأمانة :", data: proj?.municipality},
        {head: "البلدية :", data: proj?.municipal},
        {head: "الحي :", data: proj?.district},
        {head: "اسم المالك :", data: proj?.ownerName},
        {head: "رقم رخصة البناء :", data: proj?.permitNumber},
        {head: "رقم قطعة الأرض :", data: proj?.plotNumber},
        {head: "رقم المخطط :", data: proj?.schemeNumber},
        {head: "نوع البناء :", data: proj?.conType},
        {head: "وصف البناء :", data: proj?.conDesc},
        {head: "عدد الأدوار :", data: proj?.floorCount},
        {head: "مكتب المصمم المعتمد :", data: proj?.desOffice},
        {head: "المكتب الهندسي المشرف :", data: proj?.superOffice},
        {head: "مقاول البناء :", data: proj?.contractor},
        {head: "اسم المهندس المشرف :", data: proj?.superEng},
    ];

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const id = _id;
            await muAxios.post('/delete-project', {id})
            toast.success('تم حذف المشروع بنجاح')
            handleClose();
            await router.push('/projects?currentPage=1&pageSize=5')
        } catch (e) {
            console.log({e})
            toast.error(e.response?.data?.message ?? 'لقد حدث خطأ ما')
            setLoading(false)
        }
        setLoading(false)

    }

    const handleDownload = () => {
        try {
            const aTag = document.createElement("a");
            aTag.href = `/api/first-report?id=${_id}`;
            aTag.download = `تقرير ${proj.projectName}`
            document.body.appendChild(aTag);
            aTag.click();
            document.body.removeChild(aTag);
            // const res = await muAxios.post('/first-report', {
            //     data: data.project
            // })
        } catch (e) {
            console.log({e})
            toast.error('لقد حدث خطأ ما')
        }
    }

    const handleEdit = async () => {
        await router.push(`/projects/edit-project/${project?._id}`);
    };

    if (router.isFallback || !project) {
        return (
            <Backdrop
                sx={{
                    bgcolor: "white",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={true}
            >
                <CircularProgress color="secondary" size={200}/>
            </Backdrop>
        );
    }

    return (
        <Container
            maxWidth={false}
            sx={{mb: 5, mt: 7, pl: {xs: 3, sm: 3, md: 3}, pb: 5}}
        >
            {
                open && (
                    <Dialog open={open} onClose={handleClose}>
                        <Grid container spacing={2} mb={2} padding={2}>
                            <Grid item xs={12}>
                                <DialogTitle>
                                    <Grid container alignItems={'center'} justifyContent={'center'}>
                                        هل أنت متأكد من حذف {proj?.projectName}؟
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

            <Tooltip title={"الرئيسية"}>
                <Fab
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: {xs: "42%", sm: "47%", lg: "48%", xl: "49%"},
                    }}
                    color={"inherit"}
                    size={"large"}
                >
                    <Link href={"/projects?currentPage=1&pageSize=5"}>
                        <IconButton>
                            <HomeOutlined sx={{fontSize: 40}}/>
                        </IconButton>
                    </Link>
                </Fab>
            </Tooltip>

            <Grid container mt={5}>
                <Grid item xs={12}>
                    <Card sx={{mb: -2, borderRadius: 10}}>
                        <CardHeader
                            sx={{mt: 3}}
                            title={
                                <Grid
                                    container
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                >
                                    <Typography variant={"h3"}>
                                        {project?.projectName}
                                    </Typography>
                                </Grid>
                            }
                        />
                        <Carousel
                            sx={{
                                marginTop: {xs: 5, lg: 10},
                                marginX: {xs: 0, lg: 13},
                                px: {xs: 0, lg: 10},
                            }}
                            NextIcon={<ArrowLeft sx={{fontSize: 40}}/>}
                            PrevIcon={<ArrowRight sx={{fontSize: 40}}/>}
                            width={"70rem"}
                            height={"40rem"}
                            navButtonsAlwaysVisible={true}
                        >
                            {project?.images?.map((image, i) => (
                                <CardMedia
                                    key={i}
                                    component={"img"}
                                    image={image.src}
                                    width={"70rem"}
                                    height={"100%"}
                                    alt={image.name}
                                />
                            ))}
                        </Carousel>
                        <CardContent>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="center"
                            >
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        background:
                                            "linear-gradient(to left, #24243e, #302b63, #0f0c29)",
                                        borderRadius: 10,
                                    }}
                                    elevation={10}
                                >
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell
                                                    width={"20%"}
                                                    align="center"
                                                    sx={{color: "white"}}
                                                >
                                                    <Typography variant="h6">
                                                        المعلومات الاساسية
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Table>
                                                        <TableBody>

                                                            {table
                                                                .slice(0, 6)
                                                                .map((row) => (
                                                                    <TableRow
                                                                        key={
                                                                            row.head
                                                                        }
                                                                    >
                                                                        <TableCell
                                                                            width={
                                                                                "20%"
                                                                            }
                                                                            sx={{
                                                                                color: "white",
                                                                            }}
                                                                        >
                                                                            <Typography variant="subtitle1">
                                                                                {
                                                                                    row.head
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                color: "white",
                                                                            }}
                                                                        >
                                                                            <Typography>
                                                                                {
                                                                                    row.data
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    align="center"
                                                    sx={{color: "white"}}
                                                >
                                                    <Typography variant="h6">
                                                        معلومات المبنى
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Table>
                                                        <TableBody>

                                                            {table
                                                                .slice(6, 12)
                                                                .map((row) => (
                                                                    <TableRow
                                                                        key={
                                                                            row.head
                                                                        }
                                                                    >
                                                                        <TableCell
                                                                            width={
                                                                                "20%"
                                                                            }
                                                                            sx={{
                                                                                color: "white",
                                                                            }}
                                                                        >
                                                                            <Typography variant="body1">
                                                                                {
                                                                                    row.head
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                color: "white",
                                                                            }}
                                                                        >
                                                                            <Typography variant="body1">
                                                                                {
                                                                                    row.data
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell
                                                    align="center"
                                                    sx={{color: "white"}}
                                                >
                                                    <Typography variant="h6">
                                                        معلومات المكتب
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Table>
                                                        <TableBody>

                                                            {table
                                                                .slice(12)
                                                                .map((row) => (
                                                                    <TableRow
                                                                        key={
                                                                            row.head
                                                                        }
                                                                    >
                                                                        <TableCell
                                                                            width={
                                                                                "20%"
                                                                            }
                                                                            sx={{
                                                                                color: "white",
                                                                            }}
                                                                        >
                                                                            <Typography variant="subtitle1">
                                                                                {
                                                                                    row.head
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                color: "white",
                                                                            }}
                                                                        >
                                                                            <Typography variant="body1">
                                                                                {
                                                                                    row.data
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <SpeedDial
                ariaLabel={"options"}
                direction={"right"}
                sx={{
                    position: "absolute",
                    left: {xs: "42%", sm: "47%", lg: "48%", xl: "49%"},
                }}
                icon={<SpeedDialIcon/>}
                FabProps={{
                    color: "info",
                    sx: {
                        width: 70,
                        height: 70,
                    },
                }}
            >
                <SpeedDialAction
                    tooltipTitle={"تعديل"}
                    icon={
                        <EditOutlined
                            sx={{fontSize: 25}}
                            color={"secondary"}
                        />
                    }
                    onClick={handleEdit}
                />
                <SpeedDialAction
                    tooltipTitle={"استخراج"}
                    icon={
                        <FileDownloadOutlined sx={{fontSize: 25}} color={"primary"}/>
                    }
                    onClick={handleDownload}
                />
                <SpeedDialAction
                    tooltipTitle={"حذف"}
                    icon={
                        <DeleteOutlined sx={{fontSize: 25}} color={"error"}/>
                    }
                    onClick={handleOpen}
                />
            </SpeedDial>
        </Container>
    );
};

export default ProjectDetails;
