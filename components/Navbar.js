import {AppBar, Box, Toolbar, Typography} from "@mui/material";

const Navbar = () => {
    return (
        <Box display={'flex'}>
            <AppBar component={'nav'} position={'fixed'}>
                <Toolbar>
                    <Typography
                        variant="h5"
                        component="div"
                        fontWeight={'bold'}
                        sx={{flexGrow: 1}}>سجلَات المُحايد</Typography>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </Box>
    )
}
export default Navbar;