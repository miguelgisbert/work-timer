import { useState, useEffect, useContext, useRef } from 'react'
import { auth } from '../firebaseConfig'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { Button, Box, TextField, Popper, Typography, Snackbar, Alert, SnackbarCloseReason, Stack, Switch, ClickAwayListener } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { doc, setDoc, getFirestore, DocumentReference, getDoc } from 'firebase/firestore'
import { UserContext } from '../UserContext'
import { usePopper } from '../PopperContext'

interface LoginProps {
  showPopper: boolean
  company: DocumentReference | null
}

const Login: React.FC<LoginProps> = ({ showPopper, company }) => {

  const { user, setUser, /*loading,*/ setLoading } = useContext(UserContext)
  const { formToShow, setFormToShow } = usePopper()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isWorker, setIsWorker] = useState(false)
  const [isCompany, setIsCompany] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const loginButtonRef = useRef(null)
  const signUpButtonRef = useRef(null)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const fetchUser = async () => {
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data()
            if(data && data.isCompany) {
              setUser({ ...user, isCompany: data.isCompany }) // Update the user object with the isCompany value
            }
          } else {
            console.log('No user document!');
          }
        } else {
          setUser(null);
        }
        setLoading(false);
        setEmail('');
        setPassword('');
        setErrorMessage('');
      }
      fetchUser();
    })
    if (!auth.currentUser) {
      setLoading(false)
    }
    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    setFormToShow(showPopper ? 'signup' : 'none')
    if (company) {
      setIsWorker(true)
      setIsCompany(false)
    }
  }, [showPopper])

  const signIn = async () => {
    setFormToShow('none')
    setAnchorEl(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log("User signed in successfully.")
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError
        switch (firebaseError.code) {
          case 'auth/invalid-credential':
            setErrorMessage('Invalid user or password.')
            break;
          case 'auth/invalid-email':
            setErrorMessage('Invalid email.')
            break;
          default:
            setErrorMessage('Unknown error.')
        }
        setOpen(true)
        console.log(firebaseError.code)
      }
    }
  }

  const db = getFirestore()

  const signUp = async () => {
    setFormToShow('none')
    setAnchorEl(null)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email, 
        isWorker: isWorker, 
        isCompany: isCompany,
        company: company
      })
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError
        console.log(email, password)
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setErrorMessage('Email already in use.')
            break;
          case 'auth/weak-password':
            setErrorMessage('Weak password (6 characters).')
            break;
          case 'auth/invalid-email':
            setErrorMessage('Invalid email.')
            break;
          case 'auth/invalid-credential':
            setErrorMessage('Wrong password.')
            break;
          default:
            setErrorMessage('S\'ha produït un error desconegut.')
        }
        setOpen(true)
        console.log(firebaseError.code)
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      console.log("User signed out successfully.")
    } catch (error) {
      console.log("Error signing out:", error);
    }
  }

  const [open, setOpen] = useState(false);

  const handleClose = (_: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    handleClose(event, 'timeout');
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsWorker(event.target.checked)
    setIsCompany(!event.target.checked)
  }

  return (
    <>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
      {!user ? (
        <Box sx={{ display: "flex", alignItems: "stretch" }}>
          <Button ref={loginButtonRef} color="inherit" sx={{ display: "flex", alignItems: "center", height: "100%" }} 
            onClick={(e) => {
              setFormToShow('login')
              setAnchorEl(e.currentTarget)
            }}>
              Login
          </Button>
          <Button ref={signUpButtonRef} color="inherit" sx={{ display: "flex", alignItems: "center", height: "100%", lineHeight: 1.3 }} 
            onClick={(e) =>{
              setFormToShow('signup')
              setAnchorEl(e.currentTarget)  
            }} >
              Create <br /> Account
          </Button>
        </Box>
      ) : (
        <Box gap={2} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Typography>{user.email}</Typography>
          <Button><LogoutIcon onClick={logout} sx={{ color: "white" }} /></Button>
        </Box>
      )}
      <ClickAwayListener onClickAway={(event) => {
        if (event.target !== loginButtonRef.current && event.target !== signUpButtonRef.current) {
          setFormToShow('none');
        }
      }}>
        <Popper open={formToShow === 'login' || formToShow === 'signup'} anchorEl={isSmallScreen ? null : anchorEl} placement={isSmallScreen ? 'bottom' : 'bottom-end'} sx={{ boxShadow: 5, padding:"40px", width: isSmallScreen ? "70vw" : "340px", backgroundColor: "white", top: isSmallScreen ? '70px!important' : '20px!important', left: isSmallScreen ? '5vw!important' : 'auto' }}>
          <Box  component="form" 
                sx={{ 
                  backgroundColor: "white", 
                  width:"100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  padding: 0,
                  gap: 2 
                }} 
                padding={5} 
                onSubmit={e => {
                  console.log("test")
                  e.preventDefault()
                  if (formToShow === 'login') {
                    console.log("signing in")
                    signIn()
                  } else if (formToShow === 'signup') {
                    signUp()
                  }
                }}>
            <TextField
              required
              id="email_login"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              required
              id="password_login"
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {formToShow === 'signup' && company === null && (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Typography fontSize={14} fontWeight={isCompany ? 700 : 400}>Company</Typography>
                <Switch defaultChecked={false} inputProps={{ 'aria-label': 'ant design' }} onChange={handleSwitchChange} />
                <Typography fontSize={14} fontWeight={isWorker ? 700 : 400}>Worker</Typography>
              </Stack>
            )}
            <Button type="submit" onClick={formToShow === 'login' ? signIn : signUp}>
              {formToShow === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </Box>
        </Popper>
      </ClickAwayListener>
    </>
  )
}

export { Login, auth }