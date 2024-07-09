import { useState, useEffect, useContext, useRef } from 'react'
import { auth } from '../firebaseConfig'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { Button, Box, TextField, Popper, Typography, Snackbar, Alert, SnackbarCloseReason, ClickAwayListener, Grid } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { doc, setDoc, getFirestore, getDoc } from 'firebase/firestore'
import { UserContext } from '../UserContext'
import { usePopper } from '../PopperContext'

interface LoginProps {
  showPopper: boolean
}

const Login: React.FC<LoginProps> = ({ showPopper }) => {

  const { user, setUser, /*loading,*/ setLoading } = useContext(UserContext)
  const { formToShow, setFormToShow } = usePopper()
  const [user_name, setName] = useState<string>('')
  const [birthday, setBirthday] = useState<string>('')
  const [nameAlert, setNameAlert] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [email_confirmation, setEmailConfirmation] = useState<string>('')
  const [emailAlert, setEmailAlert] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [password_confirmation, setPasswordConfirmation] = useState<string>('')
  const [passwordAlert, setPasswordAlert] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [signUpScreen, setSignUpdScreen] = useState<number>(1)
  
  const loginButtonRef = useRef(null)
  const signUpButtonRef = useRef(null)
  
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  
  const db = getFirestore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const fetchUser = async () => {
        if (user) {
          const docRef = doc(db, 'indigitall_users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data()
            console.log("data", data)
            if(data) {
              setUser({
                ...user,
                name: data.name, // Assuming these properties exist
                birthday: data.birthday,
                email: user.email || 'default@email.com', // Provide a default value if email is null
              })
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


  const signUp = async () => {

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    if (password.length < 6 || password !== password_confirmation || !hasLetters || !hasNumbers) {
      setPasswordAlert(true)
      return
    }

    setFormToShow('none')
    setAnchorEl(null)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "indigitall_users", userCredential.user.uid), {
        name: user_name,
        birthday: birthday,
        email: email
      })
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError
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
            setErrorMessage('Unknown error.')
        }
        setOpen(true)
      }
    }
    setSignUpdScreen(1)
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

  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleNext = () => {
    switch(signUpScreen) {
      case 1:
        if (!user_name || !birthday) {
          setNameAlert(true)
          return
        }
        break;
      case 2:
        if (!validateEmail(email) || email !== email_confirmation) {
          setEmailAlert(true)
          return
        }
        break;
    }
    setSignUpdScreen(signUpScreen + 1)
    setNameAlert(false)
    setEmailAlert(false)
    setPasswordAlert(false)
  }

  const handleBack = () => {
    setSignUpdScreen(signUpScreen - 1)
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
          <Typography>{user.name}</Typography>
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
                  e.preventDefault()
                  if (formToShow === 'login') {
                    console.log("signing in")
                    signIn()
                  } else if (formToShow === 'signup') {
                    signUp()
                  }
                }}>
            {formToShow === "login" && (
              <>
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
                <Button type="submit" onClick={signIn}>
                  {'Login'}
                </Button>
              </>
            )}
            {formToShow === "signup" && signUpScreen === 1 && (
              <>
                {nameAlert && (
                  <Alert severity="error">Please enter your name and birthday.</Alert>
                )}
                <TextField
                  required
                  id="name"
                  label="Name"
                  value={user_name}
                  onChange={e => setName(e.target.value)}
                />
                <TextField
                  required
                  id="birthday"
                  label="Birthday"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={birthday}
                  onChange={e => setBirthday(e.target.value)}
                />
                <Button onClick={handleNext}>Next</Button>
              </>
            )}
            {formToShow === "signup" && signUpScreen === 2 && (
              <>
                {emailAlert && (
                  <Alert severity="error">Please enter a valid email and make sure the emails match.</Alert>
                )}
                <TextField
                  required
                  id="email_login"
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <TextField
                  error = {email !== "" && email !== email_confirmation}
                  required
                  id="email_login_confirmation"
                  label="Email"
                  value={email_confirmation}
                  onChange={e => setEmailConfirmation(e.target.value)}
                />
                <Grid container gap={3} justifyContent={"center"} marginTop={2}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleNext}>Next</Button>
                </Grid>
              </>
            )}
            {formToShow === "signup" && signUpScreen === 3 && (
              <>
                {passwordAlert && (
                  <Alert severity="error">Please make sure passwords match and are least 6 characters long and include letters and numbers.</Alert>
                )}
                <TextField
                  required
                  id="password_login"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <TextField
                  error = {password !== "" && password !== password_confirmation}
                  required
                  id="password_login_confirmation"
                  label="Confirm password"
                  type="password"
                  value={password_confirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                />
                <Grid container gap={3} justifyContent={"center"} marginTop={2}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button type="submit" onClick={signUp}>
                    {'Create Account'}
                  </Button>
                </Grid>
              </>
            )}
          </Box>
        </Popper>
      </ClickAwayListener>
    </>
  )
}

export { Login, auth }