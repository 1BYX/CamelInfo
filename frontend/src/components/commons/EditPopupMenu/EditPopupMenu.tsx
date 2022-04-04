import React, { useState, useEffect, useContext } from 'react'
import ReactDom from 'react-dom'
import classes from './EditPopupMenu.module.scss'
import { Button, TextField } from '@mui/material'
import AnimalCarousel from '../AnimalCarousel/AnimalCarousel'
import { popupContainerProps } from '../../../Interfaces/PortfolioInterfaces'
import { createPortfolio, updatePortfolio } from '../../API/portfolioApi'
import { updateSnackbarContext } from '../../../App'

const EditPopupMenu: React.FC<popupContainerProps> = (props) => {

    const [portfolioName, setPortfolioName] = useState("")
    const [portfolioNameError, setPortfolioNameError] = useState({ present: false, msg: '' })
    const [portfolioPicture, setPortfolioPicture] = useState("bear")

    const updateSnackbar = useContext(updateSnackbarContext)

    useEffect(() => {
        if (props.payload) {
            setPortfolioName(props.payload.name)
            setPortfolioPicture(props.payload.picture)
        }

    }, [])

    const handleAddPortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (portfolioName && portfolioName !== '') {
            let element = document.getElementsByClassName('selected')
            const child = element[0].lastElementChild?.lastChild?.lastChild
            let tmp = document.createElement("div")
            //@ts-ignore
            tmp.appendChild(child)
            const picture = tmp.innerHTML.toLowerCase()

            const response = await createPortfolio(portfolioName, picture)

            if (response.success) {
                props.renderPortfolios(response.newPortfolio)
                updateSnackbar('success', 'You have successfully added a portfolio')
            } else {
                updateSnackbar('error', 'Error creating portfolio, try again later')
            }

            props.handleMenuClose()
        } else {
            setPortfolioNameError({
                present: true,
                msg: "Please enter the name of the portfolio"
            })
        }
    }

    const handleUpdatePortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (portfolioName && portfolioName !== '') {

            let element = document.getElementsByClassName('selected')

            const child = element[0].lastElementChild?.lastChild?.lastChild

            let tmp = document.createElement("div")
            //@ts-ignore
            tmp.appendChild(child)
            const picture = tmp.innerHTML.toLowerCase()


            const response = await updatePortfolio(props.portfolioId, { name: portfolioName, picture: picture })
            if (response.success) {
                props.renderPortfoliosWithUpdate(response.updatedPortfolio)
                updateSnackbar('success', 'You have successfully updated a portfolio')
            } else {
                updateSnackbar('error', 'Error updating portfolio, try again later')
            }

            props.handleUpdateMenuClose()
        } else {
            setPortfolioNameError({
                present: true,
                msg: "Please enter the name of the portfolio"
            })
        }
    }

    const closeAllMenus = () => {
        props.handleMenuClose()
        props.handleUpdateMenuClose()
    }

    const animalArray = ['bear', 'cat', 'dog', 'elephant', 'fish', 'giraffe', 'lion', 'mouse', 'parrot', 'rabbit']

    const extractSelectedItem = (picture: string) => {
        return animalArray.indexOf(picture)
    }

    const handleChangePortfolioName = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.value.length > 20) {
            setPortfolioNameError({
                present: true,
                msg: "Portfolio name can't be longer than 20 symbols"
            })
        } else {
            setPortfolioName(e.target.value)
            setPortfolioNameError({
                present: false,
                msg: ""
            })
        }
    }

    return ReactDom.createPortal(
        <>
            <div className={classes.popupMenuBackground} onClick={closeAllMenus} />
            <div className={classes.popupMenu}>
                <div className={classes.popupMenu_instance}>
                    {props.type === "addPortfolio" || "updatePortfolio" ?
                        <div className={classes.popupMenu_instance_addPortfolio}>
                            <form onSubmit={props.type === "addPortfolio" ? handleAddPortfolio : props.type === "updatePortfolio" ? handleUpdatePortfolio : props.handleMenuClose}>
                                <div className={classes.popupMenu_instance_addPortfolio_input}>
                                    <TextField
                                        fullWidth
                                        id="standard-basic"
                                        error={portfolioNameError.present}
                                        helperText={portfolioNameError.msg}
                                        label="Portfolio Name"
                                        variant="standard"
                                        onChange={(e) => handleChangePortfolioName(e)}
                                        value={portfolioName}
                                    />
                                </div>
                                <div className={classes.popupMenu_instance_addPortfolio_carousel}>
                                    <AnimalCarousel selectedItem={extractSelectedItem(portfolioPicture)} />
                                </div>
                                <div className={classes.popupMenu_instance_addPortfolio_button}>
                                    <Button variant="contained" color="warning" type="submit">{props.type === "addPortfolio" ? "Create" : "Update"}</Button>
                                </div>
                            </form>
                        </div>
                        : null
                    }
                </div>
            </div>
        </>,
        //@ts-ignore
        document.getElementById('portal')
    )
}

export default EditPopupMenu
