import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { coinArray, portfolioObject } from '../../../Interfaces/PortfolioInterfaces'
import classes from './InsidePortfolio.module.scss'
import { parentPort } from 'worker_threads'

interface insidePortfolioProps {
    portfolio: portfolioObject
    dynamicPrices: any
}



const InsidePortfolio: React.FC<insidePortfolioProps> = (props) => {

    const [popupOptionsOpen, setPopupOptionsOpen] = useState({ isOpen: false, id: '' })
    const [popupPortfolioOptionsOpen, setPopupPortfolioOptionsOpen] = useState(false)
    const [displaySigns, setDisplaySigns] = useState(false)
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    const [localPrices, setLocalPrices] = useState([])

    const togglePopupOptions = (id: string) => {
        setPopupOptionsOpen(prevIsOpen => ({
            isOpen: !prevIsOpen.isOpen,
            id: id
        }))
    }

    const togglePopupPortfolioOptions = () => {
        setPopupPortfolioOptionsOpen(prevOptions => !prevOptions)
    }

    const extractLocalIds = () => {
        const localIds: Array<string> = []

        for (let j = 0; j < props.portfolio.coins.length; j++) {
            localIds.push(props.portfolio.coins[j].id)
        }
        return localIds

    }

    useEffect(() => {

    }, [])

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize);
    }, [])

    return (
        <div className={classes.insidePortfolio_wrapper}>
            <div className={classes.insidePortfolio}>
                <div className={classes.insidePortfolio_overview}>
                    <div className={classes.insidePortfolio_overview_title}>
                        <div className={classes.insidePortfolio_overview_picture}>
                            <img src={'../../../animalIcons/' + props.portfolio.picture + '.png'} />
                        </div>
                        <div className={classes.insidePortfolio_overview_name}>
                            <h2>{props.portfolio.name}</h2>
                        </div>
                    </div>
                    <div className={classes.insidePortfolio_overview_values}>
                        <div className={classes.insidePortfolio_overview_values_spent}>
                            <p>Total money allocated:</p>
                            <p>{'$' + props.portfolio.spent}</p>
                        </div>
                        <div className={classes.insidePortfolio_overview_values_revenue}>
                            <p>Total revenue:</p>
                            <p>$15945.23</p>
                        </div>
                        <div className={classes.insidePortfolio_overview_values_profit}>
                            <p>Total Profit:</p>
                            <p>$12945.23</p>
                        </div>
                    </div>
                </div>
                <div className={classes.insidePortfolio_coins_wrapper}>

                    <div className={classes.insidePortfolio_coins_heading}>Coins in this portfolio:</div>
                    <div className={classes.insidePortfolio_coins_instance_wrapper}>
                        <div></div>
                        <ul className={`${classes.insidePortfolio_coins_instance} ${classes.insidePortfolio_coins_signs}`}>
                            <li className={classes.insidePortfolio_coins_instance_img}>

                            </li>
                            <li className={classes.insidePortfolio_coins_instance_name}>
                                Name
                            </li>
                            <li className={classes.insidePortfolio_coins_instance_price}>
                                Price
                            </li>
                            <li className={classes.insidePortfolio_coins_instance_amount}>
                                Amount
                            </li>
                            <li className={classes.insidePortfolio_coins_instance_amount_in_usd}>
                                Total in USD
                            </li>
                        </ul>
                        <div></div>
                    </div>
                    <div className={classes.insidePortfolio_coins}>
                        {props.portfolio.coins.map((c) => (
                            <div className={classes.insidePortfolio_coins_instance_wrapper} key={c.id}>
                                <div className={classes.numerator}>{props.portfolio.coins.indexOf(c) + 1}</div>
                                <ul className={classes.insidePortfolio_coins_instance}>
                                    <li className={classes.insidePortfolio_coins_instance_img}>
                                        <img src={c.image} />
                                    </li>
                                    <li className={classes.insidePortfolio_coins_instance_name}>
                                        {c.name}
                                    </li>
                                    <li className={classes.insidePortfolio_coins_instance_price}>
                                        {size.width < 768 && <span className={classes.insidePortfolio_coins_instance_insideSigns}>Price: </span>}
                                        <span>
                                            {Object.keys(props.dynamicPrices).length > 0 && '$' + parseFloat(props.dynamicPrices[`${c.id}`]['usd'].toFixed(4))}
                                        </span>
                                    </li>
                                    <li className={classes.insidePortfolio_coins_instance_amount}>
                                        {size.width < 768 && <span className={classes.insidePortfolio_coins_instance_insideSigns}>Amount: </span>}
                                        <span>{parseFloat(c.amount.toFixed(4))}</span>
                                    </li>
                                    <li className={classes.insidePortfolio_coins_instance_amount_in_usd}>
                                        {size.width < 768 && <span className={classes.insidePortfolio_coins_instance_insideSigns}>Total In USD: </span>}
                                        {Object.keys(props.dynamicPrices).length > 0 && '$' + parseFloat((props.dynamicPrices[`${c.id}`]['usd'] * c.amount).toFixed(4))}
                                    </li>
                                </ul>
                                <div className={classes.options} onClick={togglePopupPortfolioOptions}>
                                    <div className={classes.empty}>
                                        {popupPortfolioOptionsOpen ?
                                            <div className={classes.popupOptions}>
                                                <span className={classes.popupOptions_add}>
                                                    Add to portfolio
                                                </span>
                                            </div>
                                            : null
                                        }
                                    </div>
                                    <Icon
                                        icon="bi:three-dots"
                                        inline={true} width="25"
                                        height="25" color="gray"
                                        className={classes.coins_dots}
                                    /></div>
                                <div className={classes.empty}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InsidePortfolio
