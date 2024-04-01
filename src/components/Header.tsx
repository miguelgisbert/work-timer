import  { AppBar, Toolbar, Box } from '@mui/material'
import { Login } from './Login'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { DocumentReference } from 'firebase/firestore'
import logo from '../assets/logo.svg'
import { useContext } from 'react'
import { ScreenSizeContext } from '../ScreenSizeContext'

interface HeaderProps {
    showPopper: boolean
    company: DocumentReference | null
  }
  
  const Header: React.FC<HeaderProps> = ({ showPopper, company }) => {
    const ScreenSize = useContext(ScreenSizeContext)
    return (
        <Box sx={{ position: "fixed", zIndex: "10", maxWidth: "1280px" }}>
            <AppBar sx={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent: "space-between", maxWidth: "1280px", position: "fixed", left: "auto", right: "auto" }}>
                <AccessAlarmIcon sx={{ color: ScreenSize === "sm" ? "transparent" : "white", marginLeft: "40px", fontSize: "40px" }} />
                <img src={logo} alt="Logo" style={{ height: ScreenSize === "sm" ? "20px" : "27px", position: "fixed", left: ScreenSize === "sm" ? "20px" : "50%", transform: ScreenSize === "sm" ? "" : "translateX(-50%)" }} />
                <Toolbar sx={{ maxWidth: "80%", display: "flex", alignItems: "stretch" }}>
                    <Login  showPopper={showPopper} company={company} />
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Header