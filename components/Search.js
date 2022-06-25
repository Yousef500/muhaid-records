import {Box, TextField} from "@mui/material";
import {useForm} from "react-hook-form";

const SearchComponent = () => {
    const {register, handleSubmit} = useForm();

    const handleSearch = (data) => {
        console.log(data.searchTerm)
    }

    return (
        <Box component={'form'} onSubmit={handleSubmit(handleSearch)}>
            <TextField
                {
                    ...register("searchTerm")
                }
                fullWidth={true}
                label={'ابحث'}
                variant={'outlined'}
            />
        </Box>
    );
}

export default SearchComponent;