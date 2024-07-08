import  { AppBar, Toolbar, Box, Typography } from '@mui/material'
import { Login } from './Login'

interface HeaderProps {
    showPopper: boolean
}
  
const Header: React.FC<HeaderProps> = ({ showPopper }) => {
    return (
        <Box sx={{ position: "fixed", zIndex: "10", maxWidth: "1280px" }}>
            <AppBar sx={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent: "space-between", maxWidth: "1280px", position: "fixed", left: "auto", right: "auto" }}>
                <Typography variant="h6" textAlign={"left"} paddingLeft={5}>Indigitall Login</Typography>
                <Toolbar sx={{ maxWidth: "80%", display: "flex", alignItems: "stretch" }}>
                    <Login  showPopper={showPopper} />
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header