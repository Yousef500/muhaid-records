import {Box, Button, Container, Grid, Step, StepButton, Stepper, Typography} from "@mui/material";
import FirstStep from "../components/FirstStep";
import {Cancel, Save} from "@mui/icons-material";
import {useState} from "react";
import SecondStep from "../components/SecondStep";
import ThirdStep from "../components/ThirdStep";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {addProject} from "../src/app/slices/projectsSlice";
import {useRouter} from "next/router";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import styled from "@emotion/styled";
import muAxios from "../lib/axios-config";
import {LoadingButton} from '@mui/lab'
import {toast} from "react-toastify";

const AddProject = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, setValue} = useForm();
    const dispatch = useDispatch();
    const router = useRouter();

    const Input = styled('input')({
        display: 'none',
    });

    const stepperLabels = ['البيانات الأساسية', 'بيانات المبنى', 'بيانات المكتب']

    const handleStep = (step) => () => {
        setActiveStep(step);
    }

    const readImages = async (images) => {
        const files = [...images].map(image => {
            const reader = new FileReader();
            return new Promise(resolve => {
                reader.readAsDataURL(image)
                reader.onload = () => resolve(reader.result.toString())
            })
        })

        return await Promise.all(files);
    }

    const handleCreateProject = async (data) => {
        setLoading(true)
        try {
            const images = await readImages(data.images);
            const res = await muAxios.post('/save-project', {...data, images: images});
            dispatch(addProject({...data, images: images}));
            await router.push('/?currentPage=1&pageSize=5')
            toast.success('تم إضافة المشروع بنجاح')
        } catch (e) {
            toast.error(e.response.data.message ?? 'لقد حدث خطأ ما')
        }
        setLoading(false);
    }

    const handleCancel = async () => {
        await router.push('/?currentPage=1&pageSize=5')
    }

    return (
        <Container maxWidth={'fluid'}>
            <Grid container spacing={1} padding={{xs: 3, sm: 5, md: 15}}>
                <Grid item xs={12}>
                    <Grid container spacing={0} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Typography variant={'h3'}>
                            إضافة مشروع
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

                            {
                                activeStep === 0 ? <FirstStep register={register}/>
                                    : activeStep === 1 ? <SecondStep register={register}/>
                                        : activeStep === 2 && <ThirdStep register={register}/>
                            }

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
                                           type={'file'} multiple {...register('images')} />
                                    <Button color={'primary'} variant={'contained'} component={'span'} fullWidth
                                            endIcon={<PhotoCameraIcon/>}>رفع صور</Button>
                                </label>
                            </Grid>
                            <Grid item xs={3.5}>

                                <Button fullWidth endIcon={<Cancel/>} onClick={handleCancel} variant={'outlined'}
                                        color={'error'}>إلغاء</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default AddProject;