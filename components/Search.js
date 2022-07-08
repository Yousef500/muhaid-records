import {Grid, TextField} from "@mui/material";
import {useForm} from "react-hook-form";

const SearchComponent = () => {
    const {register, handleSubmit} = useForm();

    const handleSearch = (data) => {
        console.log(data.searchTerm)
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