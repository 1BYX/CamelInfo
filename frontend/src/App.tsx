import classes from './App.module.scss'
import './variables.scss'
import { Route, Routes } from 'react-router-dom'
import PortfoliosContainer from './components/Portfolios/PortfoliosContainer'
import Header from './components/Header/Header'
import { Alert, createTheme, Fade, Snackbar, ThemeProvider } from '@mui/material'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import React, { useState, useEffect, useContext } from 'react'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import CoinsContainer from './components/Coins/CoinsContainer'
import InsidePortfolioContainer from './components/Portfolios/Portfolio/InsidePortfolioContainer'
import MaterialUISwitch from './components/commons/DarkThemeSwitch/DarkThemeSwitch'

export const updateSnackbarContext = React.createContext<(type: string, msg: string) => void>((type: string, msg: string) => { })

const App: React.FC = () => {

  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    type: '',
    msg: ''
  })

  const updateSnackbar = (type: string, msg: string) => {
    setSnackbar({
      isOpen: true,
      type: type,
      msg: msg
    })
    setTimeout(() => {
      setSnackbar({
        isOpen: false,
        type: '',
        msg: ''
      })
    }, 7000)
  }

  const theme = createTheme({
    palette: {
      warning: {
        main: '#ffffff',

      }
    },
    typography: {
      button: {
        textTransform: "none"
      },
      fontFamily: 'Poppins'
    }
  })

  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({
      isOpen: false,
      type: '',
      msg: ''
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <updateSnackbarContext.Provider value={updateSnackbar}>
        <div className={classes.app}>
          <div className={classes.app_header}>
            <Header />
            <div className={classes.app_content}>
              {snackbar.isOpen ? <Snackbar
                open={snackbar.isOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                message={snackbar.msg}
                TransitionComponent={Fade}
              >
                <div className={snackbar.type === 'success' ? classes.snackbar_success : snackbar.type === 'error' ? classes.snackbar_error : classes.snackbar}>
                  {snackbar.msg}
                </div>
              </Snackbar> : null}
              <Routes>
                <Route path='/portfolios/:id' element={<InsidePortfolioContainer />} />
                <Route path='/portfolios' element={<PortfoliosContainer />} />
                <Route path='/coins' element={<CoinsContainer />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={null} />
              </Routes>
            </div>
          </div>
        </div>
      </updateSnackbarContext.Provider>
    </ThemeProvider >
  );
}

export default App;
