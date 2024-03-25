import './App.css'
import { useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Timer from './components/Timer'
import Header from './components/Header'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, DocumentReference } from 'firebase/firestore'
import UsersList from './components/UsersList'

const theme = createTheme({
  components: {
   
  },
})

function App() {
  const [isCompany, setIsCompany] = useState<boolean>(false)
  const auth = getAuth()
  const db = getFirestore()
  const [company, setCompany] = useState<DocumentReference | null>(null)
  const [showPopper, setShowPopper] = useState<boolean>(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsCompany(docSnap.data().isCompany)
          if(docSnap.data().isCompany) {
            setCompany(docRef)
          }
        } else {
          console.log('No user document!');
        }
      } else {
        setIsCompany(false);
      }
    })
  }, [auth, db])

  const handleAddWorker = () => {
    setShowPopper(true)
    console.log("test")
  }

  return (
    <ThemeProvider theme={theme}>
      <Header showPopper={showPopper} company={company}  />
      {isCompany ? <UsersList onAddWorker={handleAddWorker} /> : <Timer />}
    </ThemeProvider>
  )

}

export default App