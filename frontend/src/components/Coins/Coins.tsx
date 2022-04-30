import { Button, TextField } from '@mui/material'
import { Icon } from '@iconify/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { getAllCoins } from '../API/coinsAPI'
import Loader from '../commons/Loader/Loader'
import classes from './Coins.module.scss'
import { parentPort } from 'worker_threads'
import AddToPortfolioPopupMenu from '../commons/AddToPortfolioPopupMenu/AddToPortfolioPopupMenu'
import { currentUserContext, portfoliosContext } from '../../AppContainer'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Link } from 'react-router-dom'

interface coinsProps {
    coins: any
    fetchCoins: (pageNumber: number) => void
}

const Coins: React.FC<coinsProps> = (props) => {

    const [format, setFormat] = useState('default')
    const [popupOptionsOpen, setPopupOptionsOpen] = useState({ isOpen: false, id: '' })
    const [searchText, setSearchText] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [isPending, setIsPending] = useState<boolean>(false)
    const [addToPortfolioMenuOpen, setAddToPortfolioMenuOpen] = useState({
        isOpen: false,
        id: '',
        name: '',
        image: ''
    })

    const portfolios = useContext(portfoliosContext)
    const currentUser = useContext(currentUserContext)

    useEffect(() => {
        setIsPending(true)
        addVisibility()
        window.addEventListener('resize', changeFormat)
        setIsPending(false)

        return () => window.removeEventListener('resize', changeFormat)
    }, [])

    const handleAddToPortfolioMenuOpen = (id: string, name: string, image: string) => {
        setAddToPortfolioMenuOpen({
            isOpen: true,
            id: id,
            name: name,
            image: image
        })
    }

    const handleAddToPortfolioMenuClose = () => {
        setAddToPortfolioMenuOpen({
            isOpen: false,
            id: '',
            name: '',
            image: ''
        })
    }

    const fetchNewCoins = async () => {
        setIsPending(true)
        setPageNumber((prevPageNumber: number) => prevPageNumber + 1)
        await props.fetchCoins(pageNumber + 1)
        setIsPending(false)
    }

    const addVisibility = () => {
        for (let i = 0; i < props.coins.length; i++) {
            props.coins[i].visibility = true
        }
    }

    const searchChangeHandler = (text: string) => {
        setSearchText(text)
    }

    const changeFormat = () => {
        if (window.innerWidth < 440) {
            setFormat('small')
        } else {
            setFormat('default')
        }
    }

    const togglePopupOptions = (id: string) => {
        setPopupOptionsOpen(prevIsOpen => ({
            isOpen: !prevIsOpen.isOpen,
            id: id
        }))
    }

    return (
        <div className={classes.coins}>
            <div className={classes.coins_input}>
                <div className={classes.coins_input_wrapper}>
                    <TextField id="standard-basic" label="Search for Coin" variant="outlined" fullWidth onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => searchChangeHandler(e.target.value)} value={searchText} />
                </div>
            </div>
            <div className={classes.coins_signs_instance_wrapper}>
                <div className={classes.numerator}></div>
                <div className={classes.coins_signs}>
                    <li className={classes.coins_instance_img}>

                    </li>
                    <li className={classes.coins_instance_name}>
                        Name
                    </li>
                    <li className={classes.coins_instance_ticker}>
                        Ticker
                    </li>
                    <li className={classes.coins_instance_price}>
                        Price
                    </li>
                    <li className={classes.coins_instance_24h}>
                        24h Change
                    </li>
                    <li className={classes.coins_instance_marketcap}>
                        Market Cap
                    </li>
                    <li className={classes.coins_instance_graph}>
                        Graph
                    </li>
                </div>
                <div className={classes.options}></div>
            </div>
            <div className={classes.coins_wrapper}>
                {props.coins
                    .filter((c: any) => (
                        c.name.toLowerCase().includes(searchText.toLowerCase())
                    ))
                    .map((c: any) => (
                        <div className={classes.coins_instance_wrapper} key={c.id}>
                            {/* to={`${c.id}`} */}
                            <div className={classes.numerator}>{c.market_cap_rank}</div>
                            <ul className={classes.coins_instance}>
                                <li className={classes.coins_instance_img}>
                                    <img src={c.image} />
                                </li>
                                <li className={classes.coins_instance_name}>
                                    {c.name}
                                </li>
                                <li className={classes.coins_instance_ticker}>
                                    {c.symbol.toUpperCase()}
                                </li>
                                <li className={classes.coins_instance_price}>
                                    {'$' + parseFloat(c.current_price.toFixed(4))}
                                </li>
                                {c.price_change_24h ?
                                    <li className={classes.coins_instance_24h}>
                                        {c.current_price <= 1000 ? '$' + parseFloat(c.price_change_24h.toFixed(4)) : '$' + parseFloat(c.price_change_24h.toFixed(0))}
                                    </li>
                                    : <li className={classes.coins_instance_24h}>NaN</li>
                                }
                                {c.market_cap ?
                                    <li className={classes.coins_instance_marketcap}>
                                        {'$' + c.market_cap}
                                    </li>
                                    : <li className={classes.coins_instance_marketcap}>NaN</li>}
                                <li className={classes.coins_instance_graph}>
                                    <img src={`../../../animalIcons/graph.png`} />
                                </li>
                            </ul>
                            {currentUser ?
                                <>
                                    <div className={classes.options} onClick={() => togglePopupOptions(c.id)}>
                                        <div className={classes.empty}></div>
                                        <AddRoundedIcon
                                            className={classes.coins_dots}
                                            onClick={() => handleAddToPortfolioMenuOpen(c.id, c.name, c.image)}
                                        />
                                    </div>
                                    <div className={classes.empty}></div>
                                </>
                                : null}
                        </div>
                    ))}
            </div>
            <div className={classes.loadmore_button}>
                {isPending ? <div className={classes.loader}><Loader /></div>
                    : <Button
                        variant="contained"
                        color="warning"
                        onClick={fetchNewCoins}>
                        Load more
                      </Button>}
            </div>
            {addToPortfolioMenuOpen.isOpen && <AddToPortfolioPopupMenu
                portfolios={portfolios}
                coinId={addToPortfolioMenuOpen.id}
                coinName={addToPortfolioMenuOpen.name}
                coinImage={addToPortfolioMenuOpen.image}
                closeFunction={handleAddToPortfolioMenuClose} />}
        </div>
    )
}


export default Coins


