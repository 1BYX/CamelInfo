import { newPortfolioPayload } from '../../Interfaces/PortfolioInterfaces';
import axios from 'axios'
import { coinObject } from '../../Interfaces/CoinInterfaces';
import { isLoggedIn } from './authAPI';

const instance = axios.create({
    baseURL: 'http://localhost:5000/portfolios',
    headers: { Authorization: '' }
})

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token && isLoggedIn()) {
            if (config.headers) {
                config.headers.Authorization = token
            }
        }
        return config;
    },
    error => Promise.reject(error)
)

export const getPortfolios = async () => {
    const res = await instance.get('/')
    return res.data
}

export const getOnePortfolio = async (portfolioId: string) => {
    const res = await instance.get(`/:${portfolioId}`)
    return res.data
}

export const createPortfolio = async (portfolioName: string, picture: string) => {
    const res = await instance.post('/', { name: portfolioName, picture: picture })
    return res.data
}

export const deletePortfolio = async (portfolioId: string) => {
    const res = await instance.delete('/', { data: { portfolioId: portfolioId } })
    return res.data
}

export const updatePortfolio = async (portfolioId: string | undefined, payload: newPortfolioPayload) => {
    const res = await instance.put('/', {
        portfolioId: portfolioId,
        name: payload.name,
        picture: payload.picture
    })
    return res.data
}

export const addCoin = async (addedCoin: coinObject, portfolioId: string, spent: number) => {
    const res = await instance.put('/addCoin', { addedCoin: addedCoin, portfolioId: portfolioId, spent: spent })
    // export const deleteCoin = async (coinId: string)
    console.log(res)
    return res.data
}

export const adjustCoinAmount = async (portfolioId: string, coinToUpdate: string, newSpent: number | null, newCoinAmount: number | null) => {
    const res = await instance.put('/adjustCoinAmount', { coinToUpdate: coinToUpdate, newSpent: newSpent, id: portfolioId, newCoinAmount: newCoinAmount })
    return res.data
}

export const deleteCoin = async (portfolioId: string, coinToDelete: string, newSpent: number) => {
    const res = await instance.put('/deleteCoin', { coinToDelete: coinToDelete, newSpent: newSpent, id: portfolioId })
    return res.data
}