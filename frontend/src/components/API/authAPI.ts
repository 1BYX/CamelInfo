import axios from 'axios'
import moment from 'moment'



const instance = axios.create({
    baseURL: 'http://localhost:5000',
})

export const getExpiration = () => {
    const expiration = localStorage.getItem('expires')
    if (expiration) {
        const expiresAt = JSON.parse(expiration)
        return moment(expiresAt)
    }
}

export const isLoggedIn = () => {
    console.log(getExpiration())
    console.log(moment())
    console.log(moment().isBefore(getExpiration()))
    return moment().isBefore(getExpiration())
}

export const login = async (username: string, password: string) => {
    try {
        const res = await instance.post('/login', { username: username, password: password })
        const token = res.data.token
        const expires = moment().add(Number(res.data.expiresIn.slice(0, res.data.expiresIn.length - 1)), res.data.expiresIn[res.data.expiresIn.length - 1])
        console.log(res.data)
        localStorage.setItem('token', token)
        localStorage.setItem('expires', JSON.stringify(expires.valueOf()))
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