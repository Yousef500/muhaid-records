import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
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
    ListItemButton,
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

export async function getStaticProps(ctx) {
    const {id} = ctx.params;
    if (id) {
        const {db} = await connectToDatabase();
        const projection = {
            _id: 0,
            images: 1,
            projectName: 1,
            projectAddress: 1,
            municipality: 1,
            municipal: 1,
            district: 1,
            ownerName: 1,
            permitNumber: 1,
            plotNumber: 1,
            schemeNumber: 1,
            conType: 1,
            conDesc: 1,
            floorCount: 1,
            desOffice: 1,
            superOffice: 1,
            contractor: 1,
            superEng: 1
        }
        const cursor = await db.collection('Projects').find({_id: Number(id)}).project(projection);
        const project = (await cursor.toArray())[0];

        return {
            props: {
                project: project ?? {},
                id
            }
        }
    }
    return {
        props: {
            project: {}
        }
    }
}

export async function getStaticPaths() {
    const {db} = await connectToDatabase();
    const cursor = await db.collection('Projects').find({}).project({_id: 1});
    const projects = await cursor.toArray();
    const paths = projects.map(proj => ({
        params: {id: proj._id.toString()}
    }));

    return {
        paths,
        fallback: true
    }
}

const EditProject = ({project, id}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageList, setImageList] = useState([]);
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: project
    });
    const dispatch = useDispatch();
    const router = useRouter();

    const stepperLabels = ['البيانات الأساسية', 'بيانات المبنى', 'بيانات المكتب']

    const Input = styled('input')({
        display: 'none',
    });

    useEffect(() => {
        setImageList(project.images)
    }, [project.images])

    const handleStep = (step) => () => {
        setActiveStep(step);
    }

    const readImages = async (e) => {
        try {
            const images = e.target.files;
            const files = [...images].map(image => {
                const reader = new FileReader();
                return new Promise(resolve => {
                    reader.readAsDataURL(image)
                    reader.onload = () => resolve(reader.result.toString())

                })
            })

            const imgs = await Promise.all(files);
            setImageList([...imageList, imgs[0]])
        } catch (e) {
            console.log({e})
            toast.error('لقد حدث خطأ ما')
        }
    }

    const handleCreateProject = async (data) => {
        setLoading(true)
        try {
            const res = await muAxios.post('/save-project', {...data, images: imageList});
            await router.push('/?currentPage=1&pageSize=5')
            toast.success('تم إضافة المشروع بنجاح')
        } catch (e) {
            toast.error(e.response.data.message ?? 'لقد حدث خطأ ما')
        }
        setLoading(false);
    }

    const handleRemoveImage = (index) => {
        setImageList(imageList.filter((src, id) => id !== index));
    }

    const handleCancel = async () => {
        await router.push('/?currentPage=1&pageSize=5')
    }

    if (router.isFallback) {
        return (
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={true}
            >
                <CircularProgress color="primary"/>
            </Backdrop>
        )
    }

    return (
        <Container maxWidth={'fluid'}>
            <Grid container spacing={1} padding={{xs: 3, sm: 5, md: 15}}>
                <Grid item xs={12}>
                    <Grid container spacing={0} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Typography variant={'h3'}>
                            تعديل {project.projectName}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Box component={'form'} onSubmit={handleSubmit(handleCreateProject)}>
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
                                           type={'file'} multiple {...register('images')} onChange={readImages}/>
                                    <Button color={'primary'} variant={'contained'} component={'span'} fullWidth
                                            endIcon={<PhotoCameraIcon/>}>رفع صور</Button>
                                </label>
                            </Grid>

                            <Grid item xs={3.5}>
                                <Button fullWidth endIcon={<Cancel/>} onClick={handleCancel} variant={'outlined'}
                                        color={'error'}>إلغاء</Button>
                            </Grid>

                            {imageList.length > 0 && (
                                <Grid item xs={12}>
                                    <List>
                                        <Grid container spacing={1} alignItems={'center'} justifyContent={'center'}>
                                            {imageList.map((src, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <ListItem disablePadding>
                                                        <ListItemButton onClick={() => handleRemoveImage(index)}>
                                                            <Image src={src} width={350} height={210} alt={'صورة'}/>
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