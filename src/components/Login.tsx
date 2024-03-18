import { useState, useEffect } from 'react'
import { auth } from '../firebaseConfig'
import { onAuthStateChanged, User, signOut } from 'firebase/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { Button, Box, TextField, Popper, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { set } from 'firebase/database'

function Login() {

  const [formToShow, setFormToShow] = useState<'login' | 'signup' | 'none'>('none')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setEmail('')
      setPassword('')
      setErrorMessage('')
    })
    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, []);

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
          case 'auth/wrong-password':
            setErrorMessage('Wrong password.')
            break;
          case 'auth/user-not-found':
            setErrorMessage('User not found.')
            break;
          default:
            setErrorMessage('Unknown error.')
        }
        console.log(firebaseError.code, firebaseError.message)
      }
    }
  };

  const signUp = async () => {
    setFormToShow('none')
    setAnchorEl(null)
    try {
      console.log(email, password)
      await createUserWithEmailAndPassword(auth, email, password)
      console.log("User signed up successfully.")
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
        console.log(firebaseError.code, firebaseError.message)
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.")
    } catch (error) {
      console.log("Error signing out:", error);
    }
  }


  const toggleLoginForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
    setFormToShow(formToShow === 'login' ? 'none' : 'login')
  }

  const toggleSignUpForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
    setFormToShow(formToShow === 'signup' ? 'none' : 'signup')
  }

  return (
    <>
      {!user ? (
        <>
          <Button color="inherit" onClick={toggleLoginForm}>Login</Button>
          <Button color="inherit" onClick={toggleSignUpForm} sx={{ lineHeight: 1.3 }}>Create <br /> Account</Button>
        </>
      ) : (
        <Box gap={2} sx={{ display: "flex", flexDirection: "row" }}>
          <p>{user.email}</p>
          <Button><LogoutIcon onClick={logout} /></Button>
        </Box>
      )}
      <Popper open={formToShow === 'login' || formToShow === 'signup'} anchorEl={anchorEl} placement="bottom-end" sx={{ boxShadow: 5, padding:"40px", width:"340px", backgroundColor: "white" }}>
        <Box  component="form" 
              sx={{ 
                backgroundColor: "white", 
                width:"100%", 
                display: "flex", 
                flexDirection: "column", 
                padding: 0,
                gap: 2 
              }} 
              padding={5} >
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
        </Box>
        {formToShow === 'login' && <Button onClick={signIn}>Sign In</Button>}
        {formToShow === 'signup' && <Button onClick={signUp}>Create Account</Button>}
        <Typography>{errorMessage}</Typography>
      </Popper>
      {/* <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={signIn}>Sign In</button>
      <button onClick={signUp}>Sign Up</button>
      {errorMessage && <p>{errorMessage}</p>} */}
    </>
  );
}

export { Login, auth }