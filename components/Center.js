import {Grid} from "@mui/material";

const Center = ({children}) => {
    return <Grid container spacing={0} alignItems={'center'} justifyContent={'center'}>
        {children}
    </Grid>
}

export default Center;