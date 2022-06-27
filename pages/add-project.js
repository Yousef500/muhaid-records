import {Box, Button, Grid, Stack, Step, StepButton, Stepper, Typography} from "@mui/material";
import FirstStep from "../components/FirstStep";
import {Cancel, Save} from "@mui/icons-material";
import {useState} from "react";
import SecondStep from "../components/SecondStep";
import ThirdStep from "../components/ThirdStep";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {addProject} from "../src/app/slices/projectsSlice";
import {useRouter} from "next/router";

const AddProject = () => {
    const [activeStep, setActiveStep] = useState(0);
    const {register, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const router = useRouter();

    const stepperLabels = ['البيانات الأساسية', 'بيانات المبنى', 'بيانات المكتب']

    const handleStep = (step) => () => {
        setActiveStep(step);
    }

    const handleCreateProject = (data) => {
        dispatch(addProject(data));
        router.push('/')
    }

    const handleCancel = () => {
        router.push('/')
    }

    return (
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
                            activeStep === 0 && <FirstStep register={register}/>
                        }
                        {
                            activeStep === 1 && <SecondStep register={register}/>
                        }
                        {
                            activeStep === 2 && <ThirdStep register={register}/>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction={'row'} justifyContent={'space-evenly'} spacing={2} mt={2}>
                            <Button fullWidth endIcon={<Save/>} variant={'contained'}
                                    color={'success'} type={'submit'}>حفظ</Button>
                            <Button fullWidth endIcon={<Cancel/>} onClick={handleCancel} variant={'outlined'}
                                    color={'error'}>إلغاء</Button>
                        </Stack>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    )
}

export default AddProject;