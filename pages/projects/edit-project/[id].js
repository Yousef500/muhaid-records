import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/router";
import styled from "@emotion/styled";
import {toast} from "react-toastify";
import muAxios from "../../../lib/axios-config";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    List,
    ListItem,
    ListItemButton, Paper,
    Step,
    StepButton,
    Stepper,
    Typography
} from "@mui/material";
import FirstStep from "../../../components/FirstStep";
import SecondStep from "../../../components/SecondStep";
import ThirdStep from "../../../components/ThirdStep";
import {LoadingButton} from "@mui/lab";
import {Cancel, Save} from "@mui/icons-material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Image from "next/image";
import {connectToDatabase} from "../../../lib/mongodb";
import Compress from 'compress.js'
import fs from "fs";

export async function getStaticProps(ctx) {
    const {id} = ctx.params;
    const {db} = await connectToDatabase();
    const projection = {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        createdBy: 0,
        updatedBy: 0
    }
    const cursor = await db.collection('Projects').find({_id: Number(id)}).project(projection);
    const project = (await cursor.toArray())[0];
    const images = [];
    for (let imageObject of project.images) {
        const image = await fs.promises.readFile(`${imageObject.src}`, "base64");
        images.push({
            ...imageObject,
            src: `data:${imageObject.type};base64,${image}`
        })
    }
    return {
        props: {
            project: {...project, images: images} ?? {},
            id
        }
    }
}

export async function getStaticPaths() {
    const {db} = await connectToDatabase();
    const cursor = await db.collection('Projects').find({}).project({_id: 1});
    const projects = await cursor.toArray();
    const paths = [];

    for (let proj of projects) {
        paths.push({
            params: {id: proj._id.toString()}
        })
    }

    return {
        paths,
        fallback: true
    }
}

const EditProject = ({project, id}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [compressedImages, setCompressedImages] = useState([]);
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: project
    });
    const router = useRouter();

    const stepperLabels = ['البيانات الأساسية', 'بيانات المبنى', 'بيانات المكتب']

    const Input = styled('input')({
        display: 'none',
    });

    useEffect(() => {
        setCompressedImages(project.images)
    }, [project.images])

    const handleStep = (step) => () => {
        setActiveStep(step);
    }

    const readImages = async (e) => {
        try {
            const images = e.target.files;
            const compress = new Compress();
            const data = await compress.compress([...images], {
                size: 4,
                quality: 0.75,
                type: images[0].type,
                resize: true
            });

            const src = data[0].prefix + data[0].data;
            const name = data[0].alt;
            // const files = [...images].map(image => {
            //     const reader = new FileReader();
            //     return new Promise(resolve => {
            //         reader.readAsDataURL(image)
            //         reader.onload = () => resolve(reader.result.toString())
            //
            //     })
            // })
            //
            // const imgs = await Promise.all(files);
            setCompressedImages([...compressedImages, {src: src, name: name}])
        } catch (e) {
            console.log({e})
            toast.error('لقد حدث خطأ ما')
        }
    }

    const handleUpdateProject = async (data) => {
        setLoading(true)
        try {
            const res = await muAxios.post('/update-project', {project: {...data, images: compressedImages}, id});
            await router.push('/projects?currentPage=1&pageSize=5')
            toast.success('تم إضافة المشروع بنجاح')
        } catch (e) {
            toast.error(e.response.data.message ?? 'لقد حدث خطأ ما')
        }
        setLoading(false);
    }

    const handleRemoveImage = (index) => {
        setCompressedImages(compressedImages.filter((src, id) => id !== index));
    }

    const handleCancel = async () => {
        await router.push('/projects?currentPage=1&pageSize=5')
    }

    if (router.isFallback) {
        return (
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={true}
            >
                <CircularProgress color="primary" size={200}/>
            </Backdrop>
        )
    }

    return (
        <Container maxWidth={false}>
            <Grid container spacing={1} m={'auto'} component={Paper} elevation={6} padding={{xs: 3, sm: 5, md: 15}} mt={5}>
                <Grid item xs={12}>
                    <Grid container spacing={0} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Typography variant={'h3'}>
                            تعديل {project.projectName}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Box component={'form'} onSubmit={handleSubmit(handleUpdateProject)}>
                        <Grid item xs={12} mt={1}>
                            <Stepper nonLinear activeStep={activeStep}>
                                {stepperLabels.map((label, index) => (
                                    <Step key={index}>
                                        <StepButton color={'secondary'} onClick={handleStep(index)}>
                                            {label}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>

                            <FirstStep errors={errors} register={register} step={activeStep}/>
                            <SecondStep errors={errors} register={register} step={activeStep}/>
                            <ThirdStep errors={errors} register={register} step={activeStep}/>

                        </Grid>

                        <Grid container spacing={2} my={2}>
                            <Grid item xs={3.5}>
                                <LoadingButton loading={loading} fullWidth endIcon={<Save/>} variant={'contained'}
                                               color={'success'} type={'submit'}>حفظ
                                </LoadingButton>
                            </Grid>

                            <Grid item xs={5}>
                                <label htmlFor={'contained-button-file'}>
                                    <Input accept={'image/*'} id={'contained-button-file'}
                                           type={'file'} multiple {...register('images')}
                                           onChange={readImages}/>
                                    <Button color={'primary'} variant={'contained'} component={'span'} fullWidth
                                            endIcon={<PhotoCameraIcon/>}>رفع صورة</Button>
                                </label>
                                {/*<DropzoneComponent config={componentConfig}*/}
                                {/*                   eventHandlers={readImages}*/}
                                {/*                   djsConfig={djsConfig} />*/}
                            </Grid>

                            <Grid item xs={3.5}>
                                <Button fullWidth endIcon={<Cancel/>} onClick={handleCancel} variant={'outlined'}
                                        color={'error'}>إلغاء</Button>
                            </Grid>

                            {compressedImages.length > 0 && (
                                <Grid item xs={12}>
                                    <List>
                                        <Grid container spacing={1} alignItems={'center'} justifyContent={'center'}>
                                            {compressedImages.map((image, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={image.name}>
                                                    <ListItem disablePadding>
                                                        <ListItemButton onClick={() => handleRemoveImage(index)}>
                                                            <Image src={image.src} width={450} height={300}
                                                                   alt={image.name}/>
                                                        </ListItemButton>
                                                    </ListItem>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </List>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default EditProject;