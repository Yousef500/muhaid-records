import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Avatar, Box, Grid, Paper, TextField, Typography} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import {useForm} from "react-hook-form";
import muAxios from "../lib/axios-config";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLoggedIn} from "../src/app/slices/userSlice";

export async function getServerSideProps(ctx) {
    const accessToken = ctx.req.cookies.access_token;

    if (accessToken) {
        return {
            redirect: {
                destination: '/',
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
    const dispatch = useDispatch()
    const router = useRouter();

    const handleLogin = async (credentials) => {
        setLoading(true);
        try {
            const {data} = await muAxios.post('/login', credentials);
            await router.push('/');
            toast.success("تم تسجيل الدخول بنجاح!");
            dispatch(setLoggedIn(true))
        } catch (e) {
            toast.error(e.response.data.message ?? 'لقد حدث خطأ ما');
        }
        setLoading(false);
    }

    return (
        <Grid container component="main" sx={{height: '100vh'}}>
            <Grid
                item
                xs={false}
                sm={6}
                md={7}
                sx={{
                    backgroundImage: 'url(/static/images/Best.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        تسجيل الدخول
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 1}} onSubmit={handleSubmit(handleLogin)}>
                        <TextField
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
                            dir={'ltr'}
                            error={!!errors.email}
                            helperText={errors?.email ? errors.email.message : ''}
                            InputProps={{style: {fontSize: 20}}}
                            InputLabelProps={{style: {fontSize: 20}}}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            {
                                ...register('password', {
                                    required: 'كلمة المرور مطلوبة'
                                })
                            }
                            label="*كلمة المرور"
                            type="password"
                            autoComplete="current-password"
                            dir={'ltr'}
                            error={!!errors.password}
                            helperText={errors?.password ? errors.password.message : ''}
                            InputProps={{style: {fontSize: 20}}}
                            InputLabelProps={{style: {fontSize: 20}}}
                        />
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
                </Box>
            </Grid>
        </Grid>
    )
}

export default SignIn;