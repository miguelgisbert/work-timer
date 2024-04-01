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
import { UserProvider, UserContext } from './UserContext'

function App() {
  
  const { user } = useContext(UserContext) as { user: CustomUser, loading: boolean }
  const isCompany = user?.isCompany
  // const [isCompany, setIsCompany] = useState<boolean>(false)
  //const auth = getAuth()
  //const db = getFirestore()
  const [company] = useState<DocumentReference | null>(null)
  const [showPopper, setShowPopper] = useState<boolean>(false)

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

  // useEffect(() => {
  //   onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const docRef = doc(db, 'users', user.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         const data = docSnap.data()
  //         if(data && data.isCompany) {
  //           setIsCompany(data.isCompany)
  //           setCompany(docRef)
  //         }
  //       } else {
  //         console.log('No user document!');
  //       }
  //     } else {
  //       setIsCompany(false);
  //     }
  //   })
  // }, [auth, db])

  const handleAddWorker = () => {
    setShowPopper(true)
  }

  return (
    <ThemeProvider theme={theme}>
      <ScreenSizeContext.Provider value={currentBreakpoint}><UserProvider>
        <Header showPopper={showPopper} company={company} />
        { isCompany ? (
          <UsersList onAddWorker={handleAddWorker} />
        ) : (
          <Timer />
        ) }
      </UserProvider></ScreenSizeContext.Provider>
    </ThemeProvider>
  )

}

export default App