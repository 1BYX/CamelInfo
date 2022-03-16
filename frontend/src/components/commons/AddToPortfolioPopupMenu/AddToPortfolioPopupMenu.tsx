import React, { useContext, useEffect, useState } from 'react'
import classes from './AddToPortfolioPopupMenu.module.scss'
import ReactDom from 'react-dom'
import { Button, Input, InputAdornment, TextField } from '@mui/material'
import { portfoliosContext, updatePortfoliosContext } from '../../../AppContainer'
import { portfolioObject } from '../../../Interfaces/PortfolioInterfaces'
import { getNonCustomPrice } from '../../API/coinsAPI'
import { addCoin } from '../../API/portfolioApi'
import { coinObject } from '../../../Interfaces/CoinInterfaces'

interface AddToPortfolioProps {
    portfolios: Array<portfolioObject>
    coinId: string
    coinName: string
    coinImage: string
    closeFunction: () => void
}

const AddToPortfolioPopupMenu: React.FC<AddToPortfolioProps> = (props) => {

    const [activePortfolio, setActivePortfolio] = useState({
        id: '',
        name: ''
    }) // what portfolio to add to
    const [amount, setAmount] = useState('') // amount of coins/USD
    const [crypto, setCrypto] = useState(false) // amount in USD or coin
    const [customPrice, setCustomPrice] = useState<string>('') // custom price
    const updatePortfolios = useContext(updatePortfoliosContext)

    const handleAddToPortfolio = async () => {

        const addedCoin: coinObject = {
            id: props.coinId,
            name: props.coinName,
            image: props.coinImage,
            amount: Number(amount)
        }
        const portfolioId = activePortfolio.id
        let spent

        if (customPrice !== '') {
            spent = await getNonCustomPrice(props.coinId)
        } else {
            spent = customPrice
        }

        const res = await addCoin(addedCoin, portfolioId, spent)
        const updatedPortfolio = res.updatedPortfolio

        //modify external portfolios context here, in order to display it in portfolios.

        const newPortfolios = props.portfolios.map((p: portfolioObject) => {
            if (p._id === updatedPortfolio._id) {
                p = res.updatedPortfolio
            }

            return p
        })

        updatePortfolios(newPortfolios)

    }


    return ReactDom.createPortal(
        <>
            <div className={classes.popupMenuBackground} onClick={props.closeFunction} />
            <div className={classes.addToPortfolio}>
                <div className={classes.addToPortfolio_portfolios}>
                    {props.portfolios.map((p: portfolioObject) => (
                        <div className={`${classes.addToPortfolio_portfolios_singlePortfolio} ${activePortfolio.id === p._id && classes.activePortfolio}`} onClick={() => setActivePortfolio({ id: p._id, name: p.name })}>
                            <span><img src={'../../../../animalIcons/' + p.picture + '.png'} /></span>
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
                <form className={classes.addToPortfolio_input}>
                    <TextField
                        helperText=""
                        label="Amount"
                        type="number"
                        onChange={(e) => {
                            if (e.target.value[e.target.value.length - 1]) {
                                setAmount(e.target.value)
                            }
                        }}
                        value={amount}
                    />
                    <TextField
                        helperText="Optional* Specify a custom price for which you bought the coin"
                        label="*Custom Price in USD"
                        type="number"
                        onChange={(e) => {
                            // if (e.target.value[e.target.value.length - 1] || e.target.value[e.target.value.length - 1] === '') {
                            setCustomPrice(e.target.value)
                            // }
                        }}
                        value={customPrice}
                    />
                    <div className={classes.addToPortfolio_input_button}>
                        <Button variant="contained" color="warning">Add to {activePortfolio.name}</Button>
                    </div>
                </form>
            </div>
        </>,
        //@ts-ignore
        document.getElementById('portal')
    )
}

export default AddToPortfolioPopupMenu
