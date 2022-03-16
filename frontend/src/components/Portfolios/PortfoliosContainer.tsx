import React, { useEffect, useState, useContext } from 'react'
import Portfolios from './Portfolios'
import { getPortfolios } from '../API/portfolioApi'
import Loader from '../commons/Loader/Loader'
import { portfolioObject } from '../../Interfaces/PortfolioInterfaces'
import { currentUserContext, currentUserInterface, portfoliosContext, updatePortfoliosContext } from '../../AppContainer'
import { updateSnackbarContext } from '../../App'



const PortfoliosContainer: React.FC = () => {

    // const [portfolios, setPortfolios] = useState<portfolioObject[]>([])
    const [isPending, setIsPending] = useState(false)

    const updateSnackbar = useContext(updateSnackbarContext)
    const portfolios = useContext(portfoliosContext)
    const updatePortfolios = useContext(updatePortfoliosContext)

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

    // const fetchPortfolios = async () => {
    //     setIsPending(true)
    //     const response = await getPortfolios()
    //     if (response.success !== true) {
    //         updateSnackbar('error', 'Error getting portfolios, try again later')
    //     }
    //     setPortfolios(response.portfolios)
    //     setIsPending(false);
    // }

    useEffect(() => {
        if (!portfolios) {
            setIsPending(true)
        } else {
            setIsPending(false)
        }
    }, [portfolios])

    return (
        <div>
            {isPending ? <div style={{ height: '100vh' }}><Loader /></div> : <Portfolios portfolios={portfolios} renderPortfolios={renderPortfolios} renderPortfoliosWithUpdate={renderPortfoliosWithUpdate} renderPortfoliosWithoutDeleted={renderPortfoliosWithoutDeleted} />}
        </div>
    )

}
export default PortfoliosContainer
