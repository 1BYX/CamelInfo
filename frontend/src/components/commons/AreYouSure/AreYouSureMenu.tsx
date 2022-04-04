import React, { useState } from 'react'
import classes from './AreYouSure.module.scss'
import ReactDom from 'react-dom'
import { Button } from '@mui/material'

interface AreYouSureProps {
    title: string,
    handlerFunction: (parameter?: any) => void
    closeFunction: () => void
    parameter?: any
}

const AreYouSureMenu: React.FC<AreYouSureProps> = (props) => {

    return ReactDom.createPortal(
        <>
            <div className={classes.popupMenuBackground} onClick={props.closeFunction} />
            <div className={classes.AreYouSure}>
                <div className={classes.AreYouSure_title}>
                    <h2>{props.title}</h2>
                </div>
                <div className={classes.AreYouSure_buttons}>
                    <Button variant="outlined" color="success" onClick={() => props.handlerFunction(props.parameter)}>Yes</Button>
                    <Button variant="outlined" color="error" onClick={props.closeFunction}>No</Button>
                </div>
            </div>
        </>,
        //@ts-ignore
        document.getElementById('portal')
    )
}

export default AreYouSureMenu
