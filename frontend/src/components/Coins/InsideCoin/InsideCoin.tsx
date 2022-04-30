import React, { useState } from 'react'
import classes from './InsideCoin.module.scss'

interface InsideCoinProps {

}

const InsideCoin: React.FC<InsideCoinProps> = (props) => {

    const [currentRange, setCurrentRange] = useState(1)
    const [cryptoConversionAmount, setCryptoConversionAmount] = useState(0)
    const [usdConversionAmount, setUsdConversionAmount] = useState(0)

    return (
        <div className={classes.InsideCoin_wrapper}>
            <div className={classes.InsideCoin}>
                <div className={classes.InsideCoin_info}>
                    <div className={classes.InsideCoin_info_title}>

                    </div>
                    <div className={classes.InsideCoin_info_add}>

                    </div>
                </div>
                <div className={classes.InsideCoin_convert}>

                </div>
                <div className={classes.InsideCoin_graph}>
                    <div className={classes.InsideCoin_graph_buttons}>

                    </div>
                    <div className={classes.InsideCoin_graph_chart}>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default InsideCoin
