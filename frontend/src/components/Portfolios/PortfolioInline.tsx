import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { parentPort } from 'worker_threads'
import { coinObject } from '../../Interfaces/CoinInterfaces'
import classes from './Portfolios.module.scss'

interface inlineProps {
    portfolio: {
        _id: string
        picture: string
        name: string
        spent: number
        coins: Array<coinObject>
    }
    dynamicPrices: any
}

const PortfolioInline: React.FC<inlineProps> = (props) => {

    const [revenue, setRevenue] = useState(0)

    const [localPrices, setLocalPrices] = useState<Array<{
        id: string
        price: {
            usd: number
        }
    }>>([])



    const extractLocalIds = () => {
        const localIds: Array<string> = []

        for (let j = 0; j < props.portfolio.coins.length; j++) {
            localIds.push(props.portfolio.coins[j].id)
        }
        return localIds
    }

    const calculateRevenue = () => {


        let newRevenue = 0

        for (let i = 0; i < props.portfolio.coins.length; i++) {
            for (let j = 0; j < localPrices.length; j++) {
                if (props.portfolio.coins[i].id === localPrices[j].id) {
                    newRevenue += props.portfolio.coins[i].amount * localPrices[j].price.usd
                }
            }
        }

        setRevenue(newRevenue)
    }

    useEffect(() => {
        const localIds = extractLocalIds()
        const newLocalPrices = []

        for (let i = 0; i < localIds.length; i++) {
            if (Object.keys(props.dynamicPrices).includes(localIds[i])) {
                newLocalPrices.push({ id: localIds[i], price: props.dynamicPrices[`${localIds[i]}`] })
            }
        }
        setLocalPrices(newLocalPrices)

        calculateRevenue()

    }, [props.portfolio, props.dynamicPrices])


    useEffect(() => {
        calculateRevenue()
    }, [localPrices])


    return (
        <Link to={`/portfolios/${props.portfolio._id}`} className={classes.portfolios_instance} key={props.portfolio._id}>
            <div className={classes.portfolios_instance_personalization}>
                <div className={classes.portfolios_instance_personalization_picture}>
                    <img src={`../../../animalIcons/${props.portfolio.picture}.png`} />
                </div>
                <div className={classes.portfolios_instance_personalization_name}>
                    <h4>{props.portfolio.name}</h4>
                </div>
            </div>
            <div className={classes.portfolios_instance_overview}>
                <div className={classes.portfolios_instance_overview_revenue}>
                    <div><p>Total revenue:</p></div>
                    <div><p>{'$' + parseFloat(revenue.toFixed(6))}</p></div>
                </div>
                <div className={classes.portfolios_instance_overview_change}>
                    <div><p>Profit:</p></div>
                    <div><p>{'$' + parseFloat((revenue - props.portfolio.spent).toFixed(6))}</p></div></div>
                <div className={classes.portfolios_instance_overview_graph}>
                    <img src={`../../../animalIcons/graph.png`} />
                </div>
            </div>
        </Link>
    )
}

export default PortfolioInline
