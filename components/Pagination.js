import {useDispatch, useSelector} from "react-redux";
import {Pagination, Stack} from "@mui/material";
import {setPagination} from "../src/app/slices/projectsSlice";
import {useEffect} from "react";

const CustomPagination = () => {
    const {pageSize, count} = useSelector(state => state.projects);
    const dispatch = useDispatch()

    const handleChange = (e, val) => {
        dispatch(setPagination({pageNumber: val}));
    }
    return (
        <Pagination sx={{width: '100%', fontWeight: 'extra-bold'}} count={Math.ceil(count / pageSize)}
                    color={'secondary'}
                    size={'large'}
                    showFirstButton showLastButton onChange={handleChange}/>
    )
}

export default CustomPagination