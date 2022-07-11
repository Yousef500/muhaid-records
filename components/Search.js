import {Grid, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";

const SearchComponent = () => {
    const {register, handleSubmit} = useForm();
    const {pageNumber, pageSize} = useSelector(state => state.projects);
    const router = useRouter();

    const handleSearch = async (data) => {
        await router.push(`/projects?currentPage=${pageNumber}&pageSize=${pageSize}&searchTerm=${data.searchTerm}`);
    }

    return (
        <Grid container component={'form'} onSubmit={handleSubmit(handleSearch)}>
            <Grid item xs={3}/>
            <Grid item xs={6}>
                <TextField
                    {
                        ...register("searchTerm")
                    }
                    fullWidth={true}
                    label={'ابحث'}
                    variant={'outlined'}
                    InputProps={{
                        style: {
                            borderRadius: 30,
                        }
                    }}
                />
            </Grid>
            <Grid item xs={3}/>
        </Grid>
    );
}

export default SearchComponent;