import axios from 'axios'



const instance = axios.create({
    baseURL: 'http://192.168.178.94:5000',
})

export const login = async (username: string, password: string) => {
    try {
        const res = await instance.post('/login', { username: username, password: password })
        const token = res.data.token
        localStorage.setItem('token', token)
        return res.data
    } catch (err) {
        console.log(err)
    }

}

export const register = async (username: string, password: string) => {
    try {
        const res = await instance.post('/register', { username: username, password: password })
        const { token } = res.data.token
        localStorage.setItem('token', token)
        return res.data
    } catch (err) {
        console.log(err)
    }
}

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token')
        if (token) {
            const res = await instance.get('/profile', { headers: { Authorization: token } })
            return res.data
        }
    } catch (err) {
        console.log(err)
    }
}