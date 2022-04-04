import { Button, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import { updateSnackbarContext } from '../../../App'
import { portfoliosContext, updatePortfoliosContext } from '../../../AppContainer'
import classes from './AdjustAmountPopupMenu.module.scss'
import ReactDom from 'react-dom'
import { coinObject } from '../../../Interfaces/CoinInterfaces'
import { getNonCustomPrice } from '../../API/coinsAPI'
import { adjustCoinAmount, deleteCoin, updatePortfolio } from '../../API/portfolioApi'
import { portfolioObject } from '../../../Interfaces/PortfolioInterfaces'

interface AdjustMenuProps {
    type: string
    title: string
    closeFunction: () => void
    portfolio: any
    coinId: string
}

const AdjustAmountPopupMenu: React.FC<AdjustMenuProps> = (props) => {

    const updateSnackbar = useContext(updateSnackbarContext)

    const [amount, setAmount] = useState<string>('') // amount of coins/USD
    const [crypto, setCrypto] = useState(false) // amount in USD or coin
    const [customPrice, setCustomPrice] = useState<string>('') // custom price
    const updatePortfolios = useContext(updatePortfoliosContext)

    const portfolios = useContext(portfoliosContext)


    const handleAdjustAmount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const selectedCoin = props.portfolio.coins.find((coin: coinObject) => {
            return coin.id === props.coinId
        })

        let spentDifference = 0

        if (customPrice !== '') {
            spentDifference = (Number(amount) - selectedCoin.amount) * Number(customPrice)
        } else {
            const currentPrice = await getNonCustomPrice(props.coinId)
            spentDifference = (Number(amount) - selectedCoin.amount) * Number(currentPrice)
        }


        const res = await adjustCoinAmount(props.portfolio._id, props.coinId, Number(spentDifference), Number(amount))

        if (res.success === true) {
            updateSnackbar('success', 'You have successfully adjusted coin amount')
        } else {
            updateSnackbar('error', 'Error adjusting coin amount, try again later')
        }

        const newPortfolios = portfolios.map((p: portfolioObject) => {
            if (p._id === res.updatedPortfolio._id) {
                p = res.updatedPortfolio
            }
            return p
        })

        updatePortfolios(newPortfolios)
    }

    const handleDeleteCoin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const selectedCoin = props.portfolio.coins.find((coin: coinObject) => {
            return coin.id === props.coinId
        })

        let spentDifference = 0

        if (customPrice !== '') {
            spentDifference = selectedCoin.amount * Number(customPrice)
        } else {
            const currentPrice = await getNonCustomPrice(props.coinId)
            spentDifference = selectedCoin.amount * Number(currentPrice)
        }

        const res = await deleteCoin(props.portfolio._id, props.coinId, Number(spentDifference))

        if (res.success === true) {
            updateSnackbar('success', 'You have successfully adjusted coin amount')
        } else {
            updateSnackbar('error', 'Error adjusting coin amount, try again later')
        }

        const newPortfolios = portfolios.map((p: portfolioObject) => {
            if (p._id === res.updatedPortfolio._id) {
                p = res.updatedPortfolio
            }
            return p
        })

        updatePortfolios(newPortfolios)
    }

    return ReactDom.createPortal(
        <>
            <div className={classes.popupMenuBackground} onClick={props.closeFunction} />
            {props.type === "adjust"
                ? <form className={classes.AdjustAmount} onSubmit={(e) => handleAdjustAmount(e)}>
                    <div className={classes.AdjustAmount_title}>
                        <h2>Adjust amount for {props.title}</h2>
                    </div>
                    <div className={classes.AdjustAmount_amount}>
                        <TextField variant="outlined" label="New Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div className={classes.AdjustAmount_customPrice}>
                        <TextField variant="outlined" label="*Custom Price" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} />
                    </div>
                    <div className={classes.AdjustAmount_buttons}>
                        <Button variant="outlined" color="success" type="submit">Done</Button>
                        <Button variant="outlined" color="error" onClick={props.closeFunction}>Cancel</Button>
                    </div>
                </form>
                : props.type === "delete"
                    ? <form className={classes.AdjustAmount} onSubmit={(e) => handleDeleteCoin(e)}>
                        <div className={classes.AdjustAmount_title}>
                            <h2>Delete {props.title}?</h2>
                        </div>
                        <div className={classes.AdjustAmount_customPrice}>
                            <TextField variant="outlined" label="*Custom Price" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} />
                        </div>
                        <div className={classes.AdjustAmount_buttons}>
                            <Button variant="outlined" color="success" type="submit">Yes</Button>
                            <Button variant="outlined" color="error" onClick={props.closeFunction}>Cancel</Button>
                        </div>
                    </form>
                    : null
            }
        </>,
        //@ts-ignore
        document.getElementById('portal')
    )
}

export default AdjustAmountPopupMenu
