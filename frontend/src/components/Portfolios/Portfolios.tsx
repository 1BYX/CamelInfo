import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import './Portfolios.module.scss'
import { Button } from '@mui/material'
import classes from './Portfolios.module.scss'
import { Icon } from '@iconify/react'
import EditPopupMenu from '../commons/EditPopupMenu/EditPopupMenu'
import { portfolioObject } from '../../Interfaces/PortfolioInterfaces'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { deletePortfolio } from '../API/portfolioApi'
import AreYouSureMenu from '../commons/AreYouSure/AreYouSureMenu'
import { updateSnackbarContext } from '../../App'
import { Link } from 'react-router-dom'
import { portfoliosContext, revenuesContext } from '../../AppContainer'
import PortfolioInline from './PortfolioInline'

const ACTIONS = {
    SET_PORTFOLIOS: 'set_portfolios'
}

interface portfolioProps {
    portfolios: portfolioObject[],
    renderPortfolios: (newPortfolio: portfolioObject) => void,
    renderPortfoliosWithUpdate: (updatedPortfolio: portfolioObject) => void,
    renderPortfoliosWithoutDeleted: (deletedPortfolioId: string) => void,
    dynamicPrices: any
}



const Portfolios: React.FC<portfolioProps> = (props) => {

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [stateOfOption, setOptionState] = useState({ id: "", isOpen: false })
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState('')
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [updatePayload, setUpdatePayload] = useState({ name: "", picture: "" })

    const updateSnackbar = useContext(updateSnackbarContext)

    const handleMenuOpen = () => {
        setIsAddOpen(true)
    }

    const handleMenuClose = () => {
        setIsAddOpen(false)
    }

    const handleUpdateMenuOpen = (name: string = "portfolioDefault", picture: string = "dog") => {
        setUpdatePayload(prevState => ({ ...prevState, name: name, picture: picture }))
        setIsUpdateOpen(true)
        setOptionState(prevState => ({
            ...prevState,
            isOpen: false
        }))
    }

    const handleDeletePortfolio = async (deletedPortfolio: string) => {
        const response = await deletePortfolio(deletedPortfolio)
        if (response.success === true) {
            updateSnackbar('success', 'You have successfully deleted a portfolio')
        } else {
            updateSnackbar('error', 'Error deleting portfolio, try again later')
        }
        props.renderPortfoliosWithoutDeleted(deletedPortfolio)
        setIsDeleteOpen(false)
    }

    const handleUpdateMenuClose = () => {
        setIsUpdateOpen(false)
    }

    const handleDeleteMenuOpen = (pid: string) => {
        setOptionState(prevState => ({
            ...prevState,
            isOpen: false
        }))
        setItemToDelete(pid)
        setIsDeleteOpen(true)
    }

    const handleDeleteMenuClose = () => {
        setItemToDelete('')
        setIsDeleteOpen(false)
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


    return (
        <div className={classes.portfolios}>
            <div className={classes.portfolios_wrapper}>

                {props.portfolios.map((p: portfolioObject) => (
                    <div className={classes.portfolios_instance_wrapper} key={p._id}>
                        <PortfolioInline portfolio={p} dynamicPrices={props.dynamicPrices} />
                        <div className={classes.options_wrapper}>
                            {stateOfOption.id === p._id && stateOfOption.isOpen &&
                                <div className={classes.popupOptions}>
                                    <div className={classes.popupOptions_instance}>
                                        <div className={classes.popupOptions_instance_edit} onClick={() => handleUpdateMenuOpen(p.name, p.picture)}>
                                            <span><EditIcon className={classes.popupOptions_instance_icon} /></span><span>Edit</span>
                                        </div>
                                        <div className={classes.popupOptions_instance_delete} onClick={() => handleDeleteMenuOpen(p._id)}>
                                            <span><DeleteIcon className={classes.popupOptions_instance_icon} /></span><span>Delete</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            <Icon
                                icon="bi:three-dots"
                                inline={true} width="25"
                                height="25" color="gray"
                                className={classes.portfolios_instance_dots}
                                onClick={() => handleOptionsToggle(p._id)}
                            />
                            <div></div>
                        </div>

                    </div>

                ))}

                {props.portfolios.length < 5 ?
                    <div className={classes.portfolios_button}>
                        <Button variant="contained" color="warning" onClick={handleMenuOpen}>Create New</Button>
                    </div>
                    : null
                }
            </div>
            {isAddOpen ?
                <EditPopupMenu
                    type="addPortfolio"
                    isAddOpen={isAddOpen}
                    handleUpdateMenuClose={handleUpdateMenuClose}
                    handleMenuClose={handleMenuClose}
                    renderPortfolios={props.renderPortfolios}
                    handleOptionsToggle={handleOptionsToggle}
                    renderPortfoliosWithUpdate={props.renderPortfoliosWithUpdate}
                    renderPortfoliosWithoutDeleted={props.renderPortfoliosWithoutDeleted}
                /> : null}

            {isUpdateOpen ?
                <EditPopupMenu
                    type="updatePortfolio"
                    portfolioId={stateOfOption.id}
                    isAddOpen={isAddOpen}
                    handleUpdateMenuClose={handleUpdateMenuClose}
                    handleMenuClose={handleMenuClose}
                    renderPortfolios={props.renderPortfolios}
                    handleOptionsToggle={handleOptionsToggle}
                    renderPortfoliosWithUpdate={props.renderPortfoliosWithUpdate}
                    renderPortfoliosWithoutDeleted={props.renderPortfoliosWithoutDeleted}
                    payload={updatePayload}
                /> : null}
            {isDeleteOpen ?
                <AreYouSureMenu
                    title="Are you sure you want to delete?"
                    handlerFunction={handleDeletePortfolio}
                    closeFunction={handleDeleteMenuClose}
                    parameter={itemToDelete}
                /> : null}
        </div >
    )
}

export default Portfolios
