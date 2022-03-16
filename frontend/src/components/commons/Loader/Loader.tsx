import React from 'react'
import classes from './Loader.module.scss'

const Loader: React.FC = () => {
    return (
        <div className={classes.loader_wrapper}>
            <div className={classes.lds_ellipsis}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Loader
