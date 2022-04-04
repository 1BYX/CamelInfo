import React, { useContext, useEffect, useState } from 'react'
import classes from './AddToPortfolioPopupMenu.module.scss'
import ReactDom from 'react-dom'
import { Button, Input, InputAdornment, TextField } from '@mui/material'
import { portfoliosContext, updatePortfoliosContext } from '../../../AppContainer'
import { portfolioObject } from '../../../Interfaces/PortfolioInterfaces'
import { getNonCustomPrice } from '../../API/coinsAPI'
import { addCoin } from '../../API/portfolioApi'
import { coinObject } from '../../../Interfaces/CoinInterfaces'
import { updateSnackbarContext } from '../../../App'

interface AddToPortfolioProps {
    portfolios: Array<portfolioObject>
    coinId: string
    coinName: string
    coinImage: string
    closeFunction: () => void
}

const AddToPortfolioPopupMenu: React.FC<AddToPortfolioProps> = (props) => {

    const updateSnackbar = useContext(updateSnackbarContext)

    const [activePortfolio, setActivePortfolio] = useState({
        id: '',
        name: ''
    }) // what portfolio to add to
    const [crypto, setCrypto] = useState(false) // amount in USD or coin

    const [amount, setAmount] = useState('') // amount of coins/USD
    const [customPrice, setCustomPrice] = useState<string>('') // custom price

    const [amountError, setAmountError] = useState({
        present: false,
        msg: ''
    }) // error setter for amount
    const [customPriceError, setCustomPriceError] = useState({
        present: false,
        msg: ''
    }) // error setter for custom price

    const updatePortfolios = useContext(updatePortfoliosContext)

    const handleAddCoin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (amount && amount !== '') {

            props.closeFunction()
            const addedCoin: coinObject = {
                id: props.coinId,
                name: props.coinName,
                image: props.coinImage,
                amount: Number(amount)
            }
            const portfolioId = activePortfolio.id
            let spent = 0

            if (customPrice === '') {
                spent = await getNonCustomPrice(props.coinId)
                spent *= Number(amount)
            } else {
                spent = Number(customPrice) * Number(amount)
            }

            const res = await addCoin(addedCoin, portfolioId, spent)

            if (res.success === true) {
                updateSnackbar('success', 'You have successfully added a coin')
            } else {
                updateSnackbar('error', 'Error adding a coin, try again later')
            }

            //modify external portfolios context here, in order to display it in portfolios.

            const newPortfolios = props.portfolios.map((p: portfolioObject) => {
                if (p._id === res.updatedPortfolio._id) {
                    p = res.updatedPortfolio
                }
                return p
            })

            updatePortfolios(newPortfolios)
        } else {
            setAmountError({
                present: true,
                msg: "Please specify the amount"
            })
        }

    }

    const handleChangeAmount = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        console.log(e.target.value[e.target.value.length - 1])
        if (Number(e.target.value) > 1000000000) {
            setAmountError({
                present: true,
                msg: "Amount can't be greater than 1.000.000.000"
            })
        } else {
            const nums = /^\d+$/
            if (nums.test(e.target.value) || e.target.value === '') {
                setAmount(e.target.value)
            }
            setAmountError({
                present: false,
                msg: ""
            })
        }
    }


    return ReactDom.createPortal(
        <>
            <div className={classes.popupMenuBackground} onClick={props.closeFunction} />
            <div className={classes.addToPortfolio}>
                <div className={classes.addToPortfolio_portfolios}>
                    {props.portfolios.map((p: portfolioObject) => (
                        <div key={p._id} className={`${classes.addToPortfolio_portfolios_singlePortfolio} ${activePortfolio.id === p._id && classes.activePortfolio}`} onClick={() => setActivePortfolio({ id: p._id, name: p.name })}>
                            <span><img src={'../../../../animalIcons/' + p.picture + '.png'} /></span>
                            <span>{p.name}</span>
                        </div>
                    ))}
                </div>
                <form className={classes.addToPortfolio_input} onSubmit={(e) => handleAddCoin(e)}>
                    <TextField
                        type='number'
                        error={amountError.present}
                        helperText={amountError.msg}
                        label="Amount"
                        onChange={(e) => {
                            handleChangeAmount(e)
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
                        <Button variant="contained" color="warning" type="submit">Add to {activePortfolio.name}</Button>
                    </div>
                </form>
            </div>
        </>,
        //@ts-ignore
        document.getElementById('portal')
    )
}

export default AddToPortfolioPopupMenu
