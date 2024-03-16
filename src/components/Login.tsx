import { useState, useEffect } from 'react'
import { auth } from '../firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { Button, Box, TextField, Popper, Typography } from '@mui/material'

function Login() {

  console.log(auth)

  const [showLogin, setShowLogin] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setEmail('')
      setPassword('')
      setErrorMessage('')
    });

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, []);

  const signIn = async () => {

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
    try {
      console.log(email, password)
      console.log(auth)
      await createUserWithEmailAndPassword(auth, email, password)
      console.log("User signed up successfully.")
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setErrorMessage('Aquest correu electrònic ja està en ús.')
            break;
          case 'auth/invalid-email':
            setErrorMessage('El correu electrònic introduït no és vàlid.')
            break;
          case 'auth/weak-password':
            setErrorMessage('La contrasenya introduïda és massa feble.')
            break;
          default:
            setErrorMessage('S\'ha produït un error desconegut.')
        }
        console.log(firebaseError.code, firebaseError.message)
      }
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setShowLogin(!showLogin);
  };

  return (
    <>
      {!user ? (
        <>
          <Button color="inherit" onClick={handleClick}>Login</Button>
          <Button color="inherit" onClick={signUp} sx={{ lineHeight: 1.3 }}>Create <br /> Account</Button>
        </>
      ) : (
        <p>{user.email}</p>
      )}
      <Popper open={showLogin} anchorEl={anchorEl} placement="bottom-end" sx={{ boxShadow: 5, padding:"40px", width:"340px", backgroundColor: "white" }}>
        <Box  component="form" 
              sx={{ 
                backgroundColor: "white", 
                width:"100%", 
                display: 'flex', 
                flexDirection: 'column', 
                padding: 0,
                gap: 2 
              }} 
              padding={5} >
          <TextField
            required
            id="email_login"
            label="Email"
          />
          <TextField
            required
            id="password_login"
            label="Password"
            type="password"
          />
        </Box>
        <Button onClick={signIn}>Sign In</Button>
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