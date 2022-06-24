import {AppBar, Box, Toolbar, Typography} from "@mui/material";

const Navbar = () => {
    return (
        <Box display={'flex'} mb={12} sx={{width: '100%'}}>
            <AppBar component={'nav'} position={'fixed'} sx={{width: '100%'}}>
                <Toolbar sx={{width: '100%'}}>
                    <Typography
                        variant="h5"
                        component="div"
                        fontWeight={'bold'}
                        >سجلَات المُحايد</Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
export default Navbar;