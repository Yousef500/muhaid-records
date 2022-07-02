import {useDispatch, useSelector} from "react-redux";
import {Grid, Pagination} from "@mui/material";
import {setPagination} from "../src/app/slices/projectsSlice";
import {useRouter} from "next/router";

const CustomPagination = () => {
    const {pageSize, count, pageNumber} = useSelector(state => state.projects);
    const dispatch = useDispatch()
    const router = useRouter();

    const handleChange = async (e, val) => {
        dispatch(setPagination({pageNumber: val}));
        if (pageNumber !== val) await router.push(`?currentPage=${val}&pageSize=${pageSize}`)
    }
    return (
        <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center">
            <Pagination count={Math.ceil(count / pageSize)}
                        color={'secondary'}
                        size={'large'}
                        page={pageNumber}
                        showFirstButton showLastButton onChange={handleChange}/>
        </Grid>
    )
}

export default CustomPagination