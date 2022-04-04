import React, { useEffect, useState, useContext } from 'react'
import Portfolios from './Portfolios'
import { getPortfolios } from '../API/portfolioApi'
import Loader from '../commons/Loader/Loader'
import { portfolioObject } from '../../Interfaces/PortfolioInterfaces'
import { currentUserContext, currentUserInterface, portfoliosContext, pricesContext, updatePortfoliosContext } from '../../AppContainer'
import { updateSnackbarContext } from '../../App'



const PortfoliosContainer: React.FC = () => {

    const [isPending, setIsPending] = useState(false)

    const updateSnackbar = useContext(updateSnackbarContext)
    const portfolios = useContext(portfoliosContext)
    const updatePortfolios = useContext(updatePortfoliosContext)
    const dynamicPrices = useContext(pricesContext)

    const renderPortfolios = (newPortfolio: portfolioObject) => {
        updatePortfolios([...portfolios, newPortfolio])
    }

    const renderPortfoliosWithUpdate = (updatedPortfolio: portfolioObject) => {
        if (portfolios.length > 0) {
            for (let i = 0; i < portfolios.length; i++) {
                if (portfolios[i]._id === updatedPortfolio._id) {
                    const updatedPortfolios = portfolios
                    updatedPortfolios[i] = updatedPortfolio
                    updatePortfolios(updatedPortfolios)
                }
            }
        }
    }

    const renderPortfoliosWithoutDeleted = (deletedPortfolioId: string) => {
        const newPortfolios = portfolios.filter(p => p._id !== deletedPortfolioId)
        updatePortfolios(newPortfolios)
    }



    useEffect(() => {
        if (!portfolios) {
            setIsPending(true)
        } else {
            setIsPending(false)
        }
    }, [portfolios])

    return (
        <div>
            {isPending ? <div style={{ height: '100vh' }}><Loader /></div> : <Portfolios portfolios={portfolios} renderPortfolios={renderPortfolios} renderPortfoliosWithUpdate={renderPortfoliosWithUpdate} renderPortfoliosWithoutDeleted={renderPortfoliosWithoutDeleted} dynamicPrices={dynamicPrices} />}
        </div>
    )

}
export default PortfoliosContainer
