import  { AppBar, Toolbar } from '@mui/material'
import { Login } from './Login'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { DocumentReference } from 'firebase/firestore'

interface HeaderProps {
    showPopper: boolean
    company: DocumentReference | null
  }
  
  const Header: React.FC<HeaderProps> = ({ showPopper, company }) => {
    return (
        <AppBar position="static" sx={{ display: "flex", flexDirection: "row", alignItems:"center", justifyContent: "space-between" }}>
            <AccessAlarmIcon sx={{ color: "white", marginLeft: "40px", fontSize: "40px" }} />
        <Toolbar sx={{ maxWidth: "80%", display: "flex", alignItems: "stretch" }}>
            <Login  showPopper={showPopper} company={company} />
        </Toolbar>
        </AppBar>
    )
}

export default Header