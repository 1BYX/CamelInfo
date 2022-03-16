import React, { useEffect, useState } from 'react'
import { getAllCoins, getPrices } from '../API/coinsAPI'
import Loader from '../commons/Loader/Loader'
import Coins from './Coins'

const CoinsContainer: React.FC = () => {

    const [coins, setCoins] = useState<any>([])
    const [isPending, setIsPending] = useState<boolean>(false)

    const fetchCoins = async (pageNumber: number) => {
        const res = await getAllCoins(pageNumber)
        setCoins((prevCoins: any) => [...prevCoins, ...res])
    }


    useEffect(() => {
        setIsPending(true)
        fetchCoins(1).then(() => setIsPending(false))

        return () => setCoins([])
    }, [])



    return (
        <div>
            {isPending ? <div style={{ height: '100vh' }}><Loader /></div> : <Coins coins={coins} fetchCoins={fetchCoins} />}
        </div>
    )
}

export default CoinsContainer
