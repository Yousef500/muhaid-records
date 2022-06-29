import {useDispatch, useSelector} from "react-redux";
import {Grid, Pagination} from "@mui/material";
import {setPagination} from "../src/app/slices/projectsSlice";

const CustomPagination = () => {
    const {pageSize, count} = useSelector(state => state.projects);
    const dispatch = useDispatch()

    const handleChange = (e, val) => {
        dispatch(setPagination({pageNumber: val}));
    }
    return (
        <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center">
            <Pagination sx={{fontWeight: 'extra-bold'}} count={Math.ceil(count / pageSize)}
                        color={'secondary'}
                        size={'large'}
                        showFirstButton showLastButton onChange={handleChange}/>
        </Grid>
    )
}

export default CustomPagination