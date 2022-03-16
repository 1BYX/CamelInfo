import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3/coins',
})

const instanceSup = axios.create({
    baseURL: 'http://localhost:5000/coins',
})

export const getAllCoins = async (pageNumber: number) => {
    try {
        const res = await instance.get(`/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${pageNumber}&sparkline=false`)
        return res.data
    } catch (err) {
        console.log(err)
    }
}

//function for adding a coin into a portfolio, with specifying custom price or without
export const getNonCustomPrice = async (coinId: string) => {
    try {

        let currency = 'usd'
        const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}`)
        let price = res.data[`${coinId}`][`${currency}`]

        return price

    } catch (err) {
        console.log(err)
    }
}

//ping function for updating all of the coins' prices in a given portfolio
export const getPrices = async (requestCoins: Array<string>) => {
    const res = await instance.get(`https://api.coingecko.com/api/v3/simple/price?ids=${requestCoins}&vs_currencies=usd`)
    return res.data
}