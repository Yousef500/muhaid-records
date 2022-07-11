import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Avatar, Box, Grid, IconButton, InputAdornment, Paper, Stack, TextField, Typography} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import {useForm} from "react-hook-form";
import muAxios from "../lib/axios-config";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setLoggedIn} from "../src/app/slices/userSlice";
import Head from "next/head";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export async function getServerSideProps(ctx) {
    const accessToken = ctx.req.cookies.access_token;

    if (accessToken) {
        return {
            redirect: {
                destination: '/projects?currentPage=1&pageSize=5',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}


const SignIn = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()
    const router = useRouter();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLogin = async (credentials) => {
        setLoading(true);
        try {
            const {data} = await muAxios.post('/login', credentials);
            await router.push('/projects?currentPage=1&pageSize=5');
            dispatch(setLoggedIn(true));
            toast.success("تم تسجيل الدخول بنجاح!");
        } catch (e) {
            toast.error(e.response.data.message ?? 'لقد حدث خطأ ما');
        }
        setLoading(false);
    }

    return (
        <>
            <Grid container component="main" sx={{height: '100vh'}}>
                <Grid
                    className={'loginBackground'}
                    item
                    xs={false}
                    sm={6}
                    md={7}
                    lg={8}
                    sx={{
                        backgroundImage: 'url(/static/images/MainBanner.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={6} md={5} lg={4} component={Paper} elevation={6} square>
                    <Stack
                        sx={{
                            my: 8,
                            mx: 4,
                        }}
                        spacing={2}
                        direction={'column'}
                        alignItems={'center'}
                    >
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            تسجيل الدخول
                        </Typography>

                        <Box width={'100%'} padding={2} component="form" noValidate sx={{mt: 1}}
                             onSubmit={handleSubmit(handleLogin)}>
                            <TextField
                                color={'primary'}
                                dir={'ltr'}
                                type={'email'}
                                margin="normal"
                                fullWidth
                                label="*البريد الالكتروني"
                                {
                                    ...register('email', {
                                        required: 'الايميل مطلوب'
                                    })
                                }
                                autoComplete="email"
                                autoFocus
                                error={!!errors.email}
                                helperText={errors?.email ? errors.email.message : ''}
                                variant={'standard'}
                                InputProps={{style: {fontSize: 20, padding: 1}}}
                                InputLabelProps={{style: {fontSize: 20}}}
                            />

                            {/*<TextField*/}
                            {/*    color={'primary'}*/}
                            {/*    margin="normal"*/}
                            {/*    fullWidth*/}
                            {/*    {*/}
                            {/*        ...register('password', {*/}
                            {/*            required: 'كلمة المرور مطلوبة'*/}
                            {/*        })*/}
                            {/*    }*/}
                            {/*    label="*كلمة المرور"*/}
                            {/*    type={showPassword ? 'text' : 'password'}*/}
                            {/*    error={!!errors.password}*/}
                            {/*    helperText={errors?.password ? errors.password.message : ''}*/}
                            {/*
                            InputProps={{*/}
                            {/*        style: {fontSize: 20, direction: 'ltr'},*/}
                            {/*        endAdornment: (*/}
                            {/*            <InputAdornment position={'end'}>*/}
                            {/*                <IconButton onClick={handleShowPassword}>*/}
                            {/*                    {showPassword ? <VisibilityOff/> : <Visibility/>}*/}
                            {/*                </IconButton>*/}
                            {/*            </InputAdornment>*/}
                            {/*        )*/}
                            {/*    }}*/}
                            {/*    InputLabelProps={{style: {fontSize: 20}}}*/}
                            {/*/>*/}

                            <Stack spacing={1} direction={'row'} dir={'rtl'} justifyContent={'space-evenly'}>
                                <TextField
                                    color={'primary'}
                                    dir={'ltr'}
                                    margin="normal"
                                    fullWidth
                                    {
                                        ...register('password', {
                                            required: 'كلمة المرور مطلوبة'
                                        })
                                    }
                                    label="*كلمة المرور"
                                    type={showPassword ? 'text' : 'password'}
                                    error={!!errors.password}
                                    helperText={errors?.password ? errors.password.message : ''}
                                    variant={'standard'}
                                    InputProps={{
                                        style: {fontSize: 20, padding: 1},
                                    }}
                                    InputLabelProps={{style: {fontSize: 20}}}
                                />
                                <IconButton disableRipple onClick={handleShowPassword}>
                                    {showPassword ? <VisibilityOff sx={{mt: 4}}/> : <Visibility sx={{mt: 4}}/>}
                                </IconButton>
                            </Stack>
                            <LoadingButton
                                loading={loading}
                                type="submit"
                                fullWidth
                                color={'secondary'}
                                variant="contained"
                                endIcon={<LoginIcon/>}
                                sx={{mt: 3, mb: 2}}
                                size={'large'}
                            >
                                تسجيل الدخول
                            </LoadingButton>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
}

export default SignIn;
