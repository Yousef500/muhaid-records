import {TextField} from "@mui/material";

const SearchComponent = () => {
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            console.log(e.target.value)
        }
    }
    return (
        <TextField
            fullWidth={true}
            label={'ابحث'}
            variant={'outlined'}
            onKeyUp={handleSearch}
        />
    );
}

export default SearchComponent;