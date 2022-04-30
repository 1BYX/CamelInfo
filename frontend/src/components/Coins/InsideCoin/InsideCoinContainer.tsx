import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { pricesContext } from '../../../AppContainer'
import InsideCoin from './InsideCoin'

interface InsideCoinContainerProps {

}

const InsideCoinContainer: React.FC<InsideCoinContainerProps> = (props) => {


    const params = useParams()
    const coinId = params.id

    const dynamicPrices = useContext(pricesContext)

    const [currentDynamicPrice, setCurrentDynamicPrice] = useState(0)

    const [currentCoin, setCurrentCoin] = useState({
        id: coinId,
        price: currentDynamicPrice,
        // change24h: 
    })

    useEffect(() => {
        setCurrentDynamicPrice(dynamicPrices[`${coinId}`].usd)
    }, [dynamicPrices[`${coinId}`].usd])


    return (
        <InsideCoin />
    )
}

export default InsideCoinContainer
