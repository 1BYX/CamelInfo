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
    const [repeatPassword, setRepeatPassword] = useState('')

    const currentUser = useContext(currentUserContext)
    const updateCurrentUser = useContext(updateCurrentUserContext)
    const updateSnackbar = useContext(updateSnackbarContext)

    const navigate = useNavigate()


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (username && username !== '' && password && password !== '' && password === repeatPassword) {
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
                updateSnackbar('error', 'Error registering, try again later')
            }
        } else {
            console.log('error bruh')
        }
    }

    return (
        <div className={classes.login}>
            <form className={classes.login_wrapper} onSubmit={handleRegister}>
                <div className={classes.login_input}>
                    <TextField variant="standard" label="Username" name="username" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className={classes.login_input}>
                    <TextField variant="standard" label="Password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className={classes.login_input}>
                    <TextField variant="standard" label="Repeat password" name="repeatPassword" type="password" onChange={(e) => setRepeatPassword(e.target.value)} />
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
