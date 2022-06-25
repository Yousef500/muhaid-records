import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import muAxios from "../lib/axios-config";
import {toast} from "react-toastify";
import {setLoggedIn} from "../src/app/slices/userSlice";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {useRouter} from "next/router";

const Navbar = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();


    const handleLogout = async () => {
        setLoading(true)
        try {
            const {data} = await muAxios.get('/logout');
            dispatch(setLoggedIn(false));
            await router.push('/sign-in')
            toast.success('تم تسجيل الخروج بنجاح');
        } catch (e) {
            toast.error('لقد حدث خطأ ما')
        }
        setLoading(false)
    }


    return (
        <Box display={'flex'} mb={12}>
            <AppBar component={'nav'} position={'fixed'} sx={{width: '100%'}}>
                <Toolbar sx={{width: '100%'}}>
                    <Typography
                        variant="h5"
                        component="div"
                        fontWeight={'bold'}
                    >سجلَات المُحايد</Typography>

                    <LoadingButton loading={loading} color={'inherit'} sx={{ml: 'auto'}} onClick={handleLogout}>تسجيل
                        الخروج</LoadingButton>

                </Toolbar>
            </AppBar>
            <Toolbar/>
        </Box>
    )
}
export default Navbar;