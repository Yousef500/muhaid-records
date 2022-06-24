import {Box, TextField} from "@mui/material";
import {useState} from "react";

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(searchTerm)
    }

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    }
    return (
        <Box component={'form'} onSubmit={handleSearch}>
            <TextField
                fullWidth={true}
                label={'ابحث'}
                variant={'outlined'}
                onChange={handleInputChange}
            />
        </Box>
    );
}

export default SearchComponent;