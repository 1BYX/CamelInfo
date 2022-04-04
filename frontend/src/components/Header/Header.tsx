import React, { useContext } from 'react'
import { Icon } from '@iconify/react'
import classes from './Header.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { currentUserContext, currentUserInterface, updateCurrentUserContext } from '../../AppContainer'
import AreYouSureMenu from '../commons/AreYouSure/AreYouSureMenu'
import { Switch } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';

const Header: React.FC = () => {

    const [menuOpen, setMenuOpen] = useState(false)
    const [logoutMenuOpen, setLogoutMenuOpen] = useState(false)

    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    const [isProfileMenuOpen, setIsProfleMenuOpen] = useState(false)
    const navigate = useNavigate()

    const currentUser = useContext(currentUserContext)
    const updateCurrentUser = useContext(updateCurrentUserContext)

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (size.width > 768 && menuOpen) {
            setMenuOpen(false)
        }
    }, [size.width, menuOpen]);

    const menuToggleHandler = () => {
        setMenuOpen((p) => !p)
    };

    const handleMenuClose = () => {
        if (size.width < 768) setMenuOpen(false)
    }

    const handleProfileMenu = () => {
        setIsProfleMenuOpen(prevProfileMenu => !prevProfileMenu)
    }

    const handleLogout = () => {
        setLogoutMenuOpen(false)
        localStorage.removeItem('token')
        updateCurrentUser(null)
        handleProfileMenu()
        navigate('/login')
    }

    const handleLogoutMenuOpen = () => {
        setLogoutMenuOpen(true)
    }

    const handleLogoutMenuClose = () => {
        setIsProfleMenuOpen(false)
        setLogoutMenuOpen(false)
    }


    return (
        <header className={classes.header}>
            <div className={classes.header__content}>
                <Link to="/" className={classes.header__content__logo}>
                    <Icon icon="emojione-monotone:camel" className={classes.header_icon} />
                    <span className={classes.header_title}>Camelinfo</span>
                </Link>
                <nav
                    className={`${classes.header__content__nav} ${menuOpen && size.width < 768 ? classes.isMenu : ""}`}
                >
                    <ul className={classes.header_content_nav_list}>
                        <li>
                            <Switch
                                color="default"
                            // checkedIcon={<NightlightRoundIcon style={{ 'width': '10px' }} />}
                            // icon={<LightModeIcon />}
                            />
                        </li>
                        <li>
                            <Link to="/" onClick={handleMenuClose}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/portfolios" onClick={handleMenuClose}>
                                Portfolios
                            </Link>
                        </li>
                        <li>
                            <Link to="/coins" onClick={handleMenuClose}>
                                Coins
                            </Link>
                        </li>
                    </ul>
                    {currentUser ?
                        <div className={classes.profile}>
                            <h3 onClick={handleProfileMenu}>{currentUser.username}</h3>
                            {isProfileMenuOpen ? <div className={classes.profile_menu} onClick={handleLogoutMenuOpen}>Log Out</div> : null}
                        </div>

                        : <Link to="/login" onClick={handleMenuClose}>
                            <Button variant="outlined" color="success">Log in</Button>
                        </Link>}
                </nav>
                <div className={classes.header__content__toggle}>
                    <Icon icon="charm:menu-hamburger" onClick={menuToggleHandler} />
                </div>
                {logoutMenuOpen ?
                    <AreYouSureMenu title='Are you sure you want to log out?' handlerFunction={handleLogout} closeFunction={handleLogoutMenuClose} />
                    : null
                }
            </div>
        </header >

    )
}

export default Header
