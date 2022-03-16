import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { updateSnackbarContext } from '../../../App'
import { portfoliosContext, pricesContext } from '../../../AppContainer'
import { portfolioObject } from '../../../Interfaces/PortfolioInterfaces'
import { getAllCoins } from '../../API/coinsAPI'
import { getOnePortfolio } from '../../API/portfolioApi'
import Loader from '../../commons/Loader/Loader'
import InsidePortfolio from './InsidePortfolio'

const InsidePortfolioContainer: React.FC = () => {

    const params = useParams()
    const portfolioId = params.id
    const [portfolio, setPortfolio] = useState<portfolioObject>({
        _id: '',
        name: '',
        picture: '',
        coins: [],
        owner: '',
        __v: 0,
        spent: 0
    })
    const [isPending, setIsPending] = useState(false)

    const [tempPortfolio, setTempPortfolio] = useState<portfolioObject>({
        _id: '',
        name: '',
        picture: '',
        coins: [],
        owner: '',
        __v: 0,
        spent: 0
    })

    const portfolios = useContext(portfoliosContext)
    const dynamicPrices = useContext(pricesContext)



    useEffect(() => {
        setIsPending(true)


        const portfolioToSet = portfolios.find(p => {

            return p._id === portfolioId
        })

        if (portfolioToSet) {
            setPortfolio(portfolioToSet)
        } else {
            //update snackbar
        }

        setIsPending(false)

        return () => setPortfolio({
            _id: '',
            name: '',
            picture: '',
            coins: [],
            owner: '',
            __v: 0,
            spent: 0
        })
    }, [portfolios])




    return (
        <div>
            {isPending ? <Loader /> : <InsidePortfolio portfolio={portfolio} dynamicPrices={dynamicPrices} />}
        </div>
    )
}

export default InsidePortfolioContainer
