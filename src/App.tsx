import './App.css'
import { useState, useContext } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import Timer from './components/Timer'
import Header from './components/Header'
//import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { DocumentReference } from 'firebase/firestore'
import UsersList from './components/UsersList'
import { ScreenSizeContext } from './ScreenSizeContext'
import { Breakpoint, CustomUser } from './types'
import { ThemeProvider } from '@mui/material/styles'
import { UserContext } from './UserContext'
import { PopperProvider } from './PopperContext'

function App() {
  
  const { user, loading } = useContext(UserContext) as { user: CustomUser, loading: boolean }
  if (loading) {
    return <div>Loading...</div>; // Or some other loading indicator
  }
  const isCompany = user?.isCompany
  // const [isCompany, setIsCompany] = useState<boolean>(false)
  //const auth = getAuth()
  //const db = getFirestore()
  const [company] = useState<DocumentReference | null>(null)
  const [showPopper] = useState<boolean>(false)

  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  
  let currentBreakpoint: Breakpoint = 'xl';
  
  if (isXs) {
    currentBreakpoint = 'xs';
  } else if (isSm) {
    currentBreakpoint = 'sm';
  } else if (isMd) {
    currentBreakpoint = 'md';
  } else if (isLg) {
    currentBreakpoint = 'lg';
  }

  return (
    <ThemeProvider theme={theme}><PopperProvider>
      <ScreenSizeContext.Provider value={currentBreakpoint}>
        <Header showPopper={showPopper} company={company} />
        { isCompany ? (
          <UsersList />
        ) : (
          <Timer />
        ) }
      </ScreenSizeContext.Provider>
    </PopperProvider></ThemeProvider>
  )

}

export default App