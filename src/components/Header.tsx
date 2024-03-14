import  { AppBar, Toolbar } from '@mui/material'
import { Login } from './Login'

export default function Header() {
    return (
        <AppBar position="static" sx={{ alignItems:"end" }}>
        <Toolbar>
            <Login />
        </Toolbar>
        </AppBar>
    )
}