import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import App from './App'
import { getCurrentUser } from './components/API/authAPI'
import { getPrices } from './components/API/coinsAPI'
import { getPortfolios } from './components/API/portfolioApi'
import { portfolioObject } from './Interfaces/PortfolioInterfaces'

export interface currentUserInterface {
    id: string,
    username: string
}

export interface updateCurrentUserInterface {
    updateCurrentUser: (newUser: currentUserInterface | null) => void
}

export const currentUserContext = React.createContext<currentUserInterface | null>(null)
export const updateCurrentUserContext = React.createContext<((newUser: currentUserInterface | null) => void)>(() => { })
export const portfoliosContext = React.createContext<Array<portfolioObject>>([])
export const updatePortfoliosContext = React.createContext<((newPortfolios: Array<portfolioObject>) => void)>(() => { })

export const pricesContext = React.createContext<any>([])

const AppContainer = () => {

    const [currentUser, setCurrentUser] = useState<currentUserInterface | null>(null)
    const [portfolios, setPortfolios] = useState<portfolioObject[]>([])
    const [isPending, setIsPending] = useState(false)
    const [dynamicPrices, setDynamicPrices] = useState<object>({})
    const [ids, setIds] = useState<Array<string>>([])

    const udpateCurrentUser = (newUser: currentUserInterface | null) => {
        if (newUser) {
            setCurrentUser(newUser)
        } else {
            setCurrentUser(null)
        }
    }

    const updatePortfolios = (newPortfolios: Array<portfolioObject>) => {
        if (newPortfolios) {
            setPortfolios(newPortfolios)
        } else {
            setPortfolios([])
        }
    }

    const fetchPortfolios = async () => {
        setIsPending(true)
        const response = await getPortfolios()
        if (response.success !== true) {

        }
        setPortfolios(response.portfolios)
        setIsPending(false);
    }

    const fetchUser = async () => {
        const token = localStorage.getItem('token')
        if (token && token !== '') {
            const response = await getCurrentUser()
            const returnedUser = response.user
            setCurrentUser({
                id: returnedUser._id,
                username: returnedUser.username
            })
        }
    }

    const extractIds = () => {
        const newIds: Array<string> = []
        for (let i = 0; i < portfolios.length; i++) {
            for (let j = 0; j < portfolios[i].coins.length; j++) {
                if (newIds.includes(portfolios[i].coins[j].id)) {

                } else {
                    newIds.push(portfolios[i].coins[j].id)
                }
            }
        }
        return newIds

    }

    useEffect(() => {
        setIsPending(true)
        fetchUser().catch(console.error)
        fetchPortfolios().catch(console.error)
        setIsPending(false)
        return () => {
            setCurrentUser(null)
            setPortfolios([])
        }
    }, [])

    useEffect(() => {

        const newIds = extractIds()
        const setPricesOnPortfolioChange = async () => {

            const newPrices = await getPrices(newIds)
            if (Object.keys(newPrices).length > 0) {
                setDynamicPrices({ ...newPrices })
            }

        }
        setPricesOnPortfolioChange()

        setInterval(async () => {
            const newPrices = await getPrices(newIds)
            if (Object.keys(newPrices).length > 0) {
                setDynamicPrices({ ...newPrices })
            }
        }, 4000)
    }, [portfolios])

    return (
        <>
            <currentUserContext.Provider value={currentUser}>
                <updateCurrentUserContext.Provider value={udpateCurrentUser}>
                    <portfoliosContext.Provider value={portfolios}>
                        <updatePortfoliosContext.Provider value={updatePortfolios}>
                            <pricesContext.Provider value={dynamicPrices}>
                                <App />
                            </pricesContext.Provider>
                        </updatePortfoliosContext.Provider>
                    </portfoliosContext.Provider>
                </updateCurrentUserContext.Provider>
            </currentUserContext.Provider>
        </>
    )
}

export default AppContainer
