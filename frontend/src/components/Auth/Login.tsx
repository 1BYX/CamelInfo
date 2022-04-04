import React, { useContext, useState } from 'react'
import classes from './Login.module.scss'
import { Button, TextField } from '@mui/material'
import { login } from '../API/authAPI'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { currentUserContext, updateCurrentUserContext } from '../../AppContainer'
import { updateSnackbarContext } from '../../App'


const Login: React.FC = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [usernameError, setUsernameError] = useState({ present: false, msg: '' })
    const [passwordError, setPasswordError] = useState({ present: false, msg: '' })

    const currentUser = useContext(currentUserContext)
    const updateCurrentUser = useContext(updateCurrentUserContext)
    const updateSnackbar = useContext(updateSnackbarContext)

    const navigate = useNavigate()

    const handleChangeUsername = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.value.length > 20) {
            setUsernameError({
                present: true,
                msg: "Username can't be longer than 20 symbols"
            })
        } else {
            setUsername(e.target.value)
            setUsernameError({
                present: false,
                msg: ""
            })
        }
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.value.length > 20) {
            setPasswordError({
                present: true,
                msg: "Password can't be longer than 20 symbols"
            })
        } else {
            setPassword(e.target.value)
            setPasswordError({
                present: false,
                msg: ""
            })
        }
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (username && username !== '' && password && password !== '') {
            if (username.length < 4) {
                setUsernameError({
                    present: true,
                    msg: "Username can't be shorter than 4 symbols long"
                })
            } else {
                const response = await login(username, password)
                console.log(response)
                if (response.success === true) {
                    setUsername('')
                    setPassword('')
                    updateCurrentUser({
                        id: response.user._id,
                        username: response.user.username
                    })
                    navigate('/portfolios')
                } else {
                    updateSnackbar('error', 'Error logging in, try again later')
                }
            }
        } else {
            setUsernameError({
                present: true,
                msg: "Please enter your username"
            })
            setPasswordError({
                present: true,
                msg: "Please enter your password"
            })
        }
    }

    return (
        <div className={classes.login}>
            <form className={classes.login_wrapper} onSubmit={handleLogin}>
                <div className={classes.login_input}>
                    <TextField error={usernameError.present} helperText={usernameError.msg} variant="standard" label="Username" name="username" onChange={(e) => handleChangeUsername(e)} value={username} />
                </div>
                <div className={classes.login_input}>
                    <TextField error={passwordError.present} helperText={passwordError.msg} variant="standard" label="Password" name="password" type="password" onChange={(e) => handleChangePassword(e)} value={password} />
                </div>
                <div className={classes.login_button}>
                    <div className={classes.login_button_wrapper}>
                        <Button variant="contained" color="warning" type="submit">Log in</Button>
                        <Link to='/register'><span>Sign Up</span></Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
