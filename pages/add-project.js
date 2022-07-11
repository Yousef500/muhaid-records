import {
    Box,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemButton,
    Paper,
    Step,
    StepButton,
    Stepper,
    Typography,
} from "@mui/material";
import FirstStep from "../components/FirstStep";
import {Cancel, Save} from "@mui/icons-material";
import {useState} from "react";
import SecondStep from "../components/SecondStep";
import ThirdStep from "../components/ThirdStep";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import styled from "@emotion/styled";
import muAxios from "../lib/axios-config";
import {LoadingButton} from "@mui/lab";
import {toast} from "react-toastify";
import Image from "next/image";
import Compress from "compress.js";

export async function getStaticProps() {
    return {
        props: {},
    };
}

const AddProject = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageMissing, setImageMissing] = useState(false)
    const [compressedImages, setCompressedImages] = useState([]);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();
    const dispatch = useDispatch();
    const router = useRouter();

    const stepperLabels = ["البيانات الأساسية", "بيانات المبنى", "بيانات المكتب"];

    const Input = styled("input")({
        display: "none",
    });

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const readImages = async (e) => {
        try {
            const image = e.target.files;
            const compress = new Compress();
            const data = await compress.compress([...image], {
                size: 4,
                quality: 0.75,
                type: image[0].type,
                resize: true,
            });
            const src = data[0].prefix + data[0].data;
            const name = data[0].alt;
            setCompressedImages([...compressedImages, {src: src, name: name, type: image[0].type}]);
            // const files = [...images].map(image => {
            //     const reader = new FileReader();
            //     return new Promise(resolve => {
            //         reader.readAsDataURL(image)
            //         reader.onload = () => resolve(reader.result.toString())
            //     })
            // })
            //
            // const imgs = await Promise.all(files);
            // setCompressedImages([...compressedImages, {src: imgs[0], name: images[0].name}]);
        } catch (e) {
            console.log({e});
            toast.error("لقد حدث خطأ ما");
        }
    };

    const handleCreateProject = async (data) => {
        setLoading(true);
        if (compressedImages.length !== 0) {
            setImageMissing(false);
            try {
                const res = await muAxios.post("/save-project", {
                    newProject: {...data, images: compressedImages},
                });
                await router.push("/projects?currentPage=1&pageSize=5");
                toast.success("تم إضافة المشروع بنجاح");
            } catch (e) {
                toast.error(e.response.data.message ?? "لقد حدث خطأ ما");
            }
        } else {
            setImageMissing(true)
        }
        setLoading(false);
    };

    const handleRemoveImage = (index) => {
        setCompressedImages(compressedImages.filter((src, id) => id !== index));
    };

    const handleCancel = async () => {
        await router.push("/projects?currentPage=1&pageSize=5");
    };

    return (
        <Container maxWidth={false} sx={{pl: 3}}>
            <Grid container component={Paper} elevation={6} spacing={1} padding={{xs: 3, sm: 5, md: 15}}
                  my={{xs: 1, sm: 10}}
                  sx={{borderRadius: 10}}>
                <Grid item xs={12}>
                    <Grid
                        container
                        spacing={0}
                        direction={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Typography variant={"h3"}>إضافة مشروع</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Box component={"form"} onSubmit={handleSubmit(handleCreateProject)}>
                        <Grid item xs={12} mt={1}>
                            <Stepper nonLinear activeStep={activeStep}>
                                {stepperLabels.map((label, index) => (
                                    <Step key={index}>
                                        <StepButton color={"secondary"} onClick={handleStep(index)}>
                                            {label}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>

                            <FirstStep
                                errors={errors}
                                register={register}
                                step={activeStep}
                            />
                            <SecondStep
                                errors={errors}
                                register={register}
                                step={activeStep}
                            />
                            <ThirdStep
                                errors={errors}
                                register={register}
                                step={activeStep}
                            />
                        </Grid>

                        <Grid container spacing={2} my={2}>
                            <Grid item xs={3.5}>
                                <LoadingButton
                                    loading={loading}
                                    fullWidth
                                    endIcon={<Save/>}
                                    variant={"contained"}
                                    color={"success"}
                                    type={"submit"}
                                >
                                    حفظ
                                </LoadingButton>
                            </Grid>

                            <Grid item xs={5}>
                                <label htmlFor={"contained-button-file"}>
                                    <Input
                                        accept={"image/*"}
                                        id={"contained-button-file"}
                                        type={"file"}
                                        multiple
                                        {...register("images")}
                                        onChange={readImages}
                                    />
                                    <Button
                                        color={"primary"}
                                        variant={"contained"}
                                        component={"span"}
                                        fullWidth
                                        endIcon={<PhotoCameraIcon/>}
                                    >
                                        رفع صورة
                                    </Button>
                                    {imageMissing && <Typography color={'error'}>الصورة مطلوبة</Typography>}
                                </label>
                            </Grid>

                            <Grid item xs={3.5}>
                                <Button
                                    fullWidth
                                    endIcon={<Cancel/>}
                                    onClick={handleCancel}
                                    variant={"outlined"}
                                    color={"error"}
                                >
                                    إلغاء
                                </Button>
                            </Grid>

                            {compressedImages.length > 0 && (
                                <Grid item xs={12}>
                                    <List>
                                        <Grid
                                            container
                                            spacing={1}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                        >
                                            {compressedImages.map((image, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <ListItem disablePadding>
                                                        <ListItemButton
                                                            onClick={() => handleRemoveImage(index)}
                                                        >
                                                            <Image
                                                                src={image.src}
                                                                width={350}
                                                                height={210}
                                                                alt={"صورة"}
                                                            />
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
    );
};

export default AddProject;
