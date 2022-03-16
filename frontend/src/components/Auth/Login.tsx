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

    const currentUser = useContext(currentUserContext)
    const updateCurrentUser = useContext(updateCurrentUserContext)
    const updateSnackbar = useContext(updateSnackbarContext)

    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (username && username !== '' && password && password !== '') {
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
        } else {
            console.log('error bruh')
        }
    }

    return (
        <div className={classes.login}>
            <form className={classes.login_wrapper} onSubmit={handleLogin}>
                <div className={classes.login_input}>
                    <TextField variant="standard" label="Username" name="username" onChange={(e) => setUsername(e.target.value)} value={username} />
                </div>
                <div className={classes.login_input}>
                    <TextField variant="standard" label="Password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
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
