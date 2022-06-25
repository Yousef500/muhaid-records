import {useDispatch, useSelector} from "react-redux";
import {Pagination, Stack} from "@mui/material";
import {setPagination} from "../src/app/slices/projectsSlice";
import {useEffect} from "react";

const CustomPagination = () => {
    const count = useSelector(state => state.projects.count);
    const pageSize = useSelector(state => state.projects.pageSize);
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(pageSize, count)
    }, [count, pageSize])


    const handleChange = (e, val) => {
        dispatch(setPagination({pageNumber: val}));
    }
    return (
        <Pagination sx={{width: '100%'}} count={count / pageSize} color={'secondary'} size={'large'}
                    showFirstButton showLastButton onChange={handleChange}/>
    )
}

export default CustomPagination