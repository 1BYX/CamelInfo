import { Icon } from '@iconify/react'
import React, { useContext, useEffect, useState } from 'react'
import { coinArray, portfolioObject } from '../../../Interfaces/PortfolioInterfaces'
import classes from './InsidePortfolio.module.scss'
import { parentPort } from 'worker_threads'
import { portfoliosContext, updateRevenuesContext } from '../../../AppContainer'
import { Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import AdjustAmountPopupMenu from '../../commons/AdjustAmountPopupMenu/AdjustAmountPopupMenu'
import { Link } from 'react-router-dom'

interface insidePortfolioProps {
    portfolio: portfolioObject
    dynamicPrices: any
}


const InsidePortfolio: React.FC<insidePortfolioProps> = (props) => {

    const [popupOptionsOpen, setPopupOptionsOpen] = useState({ isOpen: false, id: '' })
    const [popupPortfolioOptionsOpen, setPopupPortfolioOptionsOpen] = useState(false)
    const [adjustMenuOpen, setAdjustMenuOpen] = useState({
        open: false,
        coinId: '',
        coinName: ''
    })
    const [deleteMenuOpen, setDeleteMenuOpen] = useState({
        open: false,
        coinId: '',
        coinName: ''
    })
    const [displaySigns, setDisplaySigns] = useState(false)
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const [revenue, setRevenue] = useState(0)
    const updateRevenues = useContext(updateRevenuesContext)

    const [stateOfOption, setOptionState] = useState({ id: "", isOpen: false })

    const [localPrices, setLocalPrices] = useState<Array<{
        id: string
        price: {
            usd: number
        }
    }>>([])

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
        return newRevenue
    }

    const handleOptionsToggle = (id: string) => {
        if (stateOfOption.id !== id && stateOfOption.id !== "") {
            setOptionState({
                id: "",
                isOpen: false
            })
            setOptionState(prevState => ({
                id: id,
                isOpen: !prevState.isOpen
            }))
        } else {
            setOptionState(prevState => ({
                id: id,
                isOpen: !prevState.isOpen
            }))
        }
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
                            <p>{'$' + parseFloat(revenue.toFixed(4))}</p>
                        </div>
                        <div className={classes.insidePortfolio_overview_values_profit}>
                            <p>Total Profit:</p>
                            <p>{'$' + parseFloat((revenue - props.portfolio.spent).toFixed(4))}</p>
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
                                Total
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
                                        {size.width < 768 && <span className={classes.insidePortfolio_coins_instance_insideSigns}>Total:  </span>}
                                        {Object.keys(props.dynamicPrices).length > 0 && '$' + parseFloat((props.dynamicPrices[`${c.id}`]['usd'] * c.amount).toFixed(4))}
                                    </li>
                                </ul>
                                <div className={classes.options} onClick={() => handleOptionsToggle(c.id)}>
                                    {stateOfOption.id === c.id && stateOfOption.isOpen &&
                                        <div className={classes.popupOptions}>
                                            <div className={classes.popupOptions_instance}>
                                                <div className={classes.popupOptions_instance_edit} onClick={() => setAdjustMenuOpen({ open: true, coinId: c.id, coinName: c.name })}>
                                                    <span><EditIcon className={classes.popupOptions_instance_icon} /></span><span>Edit</span>
                                                </div>
                                                <div className={classes.popupOptions_instance_delete} onClick={() => setDeleteMenuOpen({ open: true, coinId: c.id, coinName: c.name })}>
                                                    <span><DeleteIcon className={classes.popupOptions_instance_icon} /></span><span>Delete</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <Icon
                                        icon="bi:three-dots"
                                        inline={true} width="25"
                                        height="25" color="gray"
                                        className={classes.coins_dots}
                                    />
                                    <div className={classes.empty}></div>
                                </div>
                            </div>
                        ))}
                        {adjustMenuOpen.open
                            ? <AdjustAmountPopupMenu
                                title={adjustMenuOpen.coinName}
                                closeFunction={() => setAdjustMenuOpen({ open: false, coinName: '', coinId: '' })}
                                portfolio={props.portfolio}
                                coinId={adjustMenuOpen.coinId}
                                type="adjust"
                            />
                            : null
                        }
                        {deleteMenuOpen.open
                            ? <AdjustAmountPopupMenu
                                title={deleteMenuOpen.coinName}
                                closeFunction={() => setDeleteMenuOpen({ open: false, coinName: '', coinId: '' })}
                                portfolio={props.portfolio}
                                coinId={deleteMenuOpen.coinId}
                                type="delete"
                            />
                            : null
                        }
                        <div className={classes.insidePortfolio_coins_instance_wrapper}>
                            <div></div>
                            <Link to="/coins" className={classes.insidePortfolio_coins_addButton}>
                                <Button variant="contained" color="warning">Add more</Button>
                            </Link>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InsidePortfolio
