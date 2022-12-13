import axios from 'axios'

export default() => {
    return axios.create({
        withCredentials: true,
        baseURL: process.env.API_URL || 'http://localhost:3000/'
    })
}
