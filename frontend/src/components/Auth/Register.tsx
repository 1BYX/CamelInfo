import React, { useContext, useState } from 'react'
import classes from './Register.module.scss'
import { Button, TextField } from '@mui/material'
import { register } from '../API/authAPI'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { currentUserContext, updateCurrentUserContext } from '../../AppContainer'
import { updateSnackbarContext } from '../../App'

const Register: React.FC = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [usernameError, setUsernameError] = useState({ present: false, msg: '' })
    const [passwordError, setPasswordError] = useState({ present: false, msg: '' })
    const [repeatPasswordError, setRepeatPasswordError] = useState({
        present: false,
        msg: ''
    })

    const [repeatPassword, setRepeatPassword] = useState('')

    const currentUser = useContext(currentUserContext)
    const updateCurrentUser = useContext(updateCurrentUserContext)
    const updateSnackbar = useContext(updateSnackbarContext)

    const navigate = useNavigate()

    const handleChangeUsername = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.value.length > 20) {
            setUsernameError({
                present: true,
                msg: "The name can't be longer than 20 symbols"
            })
        } else {
            setUsername(e.target.value)
            setUsernameError({
                present: false,
                msg: ''
            })
        }
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.value.length > 20) {
            setPasswordError({
                present: true,
                msg: "The name can't be longer than 20 symbols"
            })
        } else {
            setPassword(e.target.value)
            setPasswordError({
                present: false,
                msg: ''
            })
        }
    }

    const handleChangeRepeatPassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.target.value.length <= 20) {
            setRepeatPassword(e.target.value)
            setRepeatPasswordError({
                present: false,
                msg: ''
            })
        }
    }


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (username && username !== '' && password && password !== '') {
            if (password === repeatPassword) {
                const response = await register(username, password)
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
                    setRepeatPasswordError({
                        present: true,
                        msg: "Passwords don't match"
                    })
                }
            } else {
                updateSnackbar('error', 'Error registering, try again later')
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
            <form className={classes.login_wrapper} onSubmit={handleRegister}>
                <div className={classes.login_input}>
                    <TextField error={usernameError.present} helperText={usernameError.msg} variant="standard" label="Username" name="username" onChange={(e) => handleChangeUsername(e)} />
                </div>
                <div className={classes.login_input}>
                    <TextField error={passwordError.present} helperText={passwordError.msg} variant="standard" label="Password" name="password" type="password" onChange={(e) => handleChangePassword(e)} />
                </div>
                <div className={classes.login_input}>
                    <TextField error={repeatPasswordError.present} helperText={repeatPasswordError.msg} variant="standard" label="Repeat password" name="repeatPassword" type="password" onChange={(e) => handleChangeRepeatPassword(e)} />
                </div>
                <div className={classes.login_button}>
                    <div className={classes.login_button_wrapper}>
                        <Button variant="contained" color="warning" type="submit">Register</Button>
                        <Link to='/login'><span>Log in</span></Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register
