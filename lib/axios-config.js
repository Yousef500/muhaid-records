import axios from 'axios'

const muAxios = axios.create({
    baseURL: '/api'
});

export default muAxios;