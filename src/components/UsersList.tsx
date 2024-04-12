import React, { useEffect, useState, useContext, useRef } from 'react'
import { Grid, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography, Popper, Backdrop, Box, TextField, Snackbar, Alert, SnackbarCloseReason } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { UserContext } from '../UserContext'
import { getFirestore, collection, where, getDocs, query, DocumentData, doc, addDoc } from 'firebase/firestore'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const UsersList: React.FC = () => {
    const { user } = useContext(UserContext)
    const [workers, setWorkers] = useState<DocumentData[]>([])
    const db = getFirestore()

    // Create worker
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    
    const addWorkerButtonRef = useRef(null)
    const [showAddWorkerForm, setShowAddWorkerForm] = useState<boolean>(false)
    const [anchorCreateWorker, setAnchorCreateWorker] = useState<null | HTMLElement>(null)

    const createWorker = async () => {
        if (user) {
            const userRef = doc(db, 'users', user.uid)
            const workersCollection = collection(db, "users")
            const workerData = {
                name: name,
                email: email,
                password: password,
                company: userRef,
                isWorker: true,
                isCompany: false
            }
            setShowAddWorkerForm(false)
            try {
                await addDoc(workersCollection, workerData)
                fetchWorkers()
              } catch (e) {
                setErrorMessage("Error adding document: " + e);
              }
        }
    }

    const fetchWorkers = async () => {
        if (user) {
          const userRef = doc(db, 'users', user.uid)
          const q = query(
            collection(db, 'users'),
            where('isWorker', '==', true),
            where('company', '==', userRef)
          )
          const querySnapshot = await getDocs(q);
          const companyWorkers = querySnapshot.docs.map(doc => doc.data())
          setWorkers(companyWorkers)
        }
    }

    useEffect(() => {
        fetchWorkers()
    }, [user])

    const [open, setOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

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
        <Grid container justifyContent="center" textAlign="center" padding={5} sx={{ paddingTop: "150px" }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
                {errorMessage}
                </Alert>
            </Snackbar>
            <Grid item>
                <Button ref={addWorkerButtonRef} sx={{ padding:"10px" }} 
                    onClick={(e) => {
                        setShowAddWorkerForm(true)
                        setAnchorCreateWorker(e.currentTarget)
                    }}>
                    <PersonAddAltIcon sx={{marginRight:"20px"}} />
                    <Typography>Add Worker</Typography>
                </Button>

                <Popper open={showAddWorkerForm} anchorEl={isSmallScreen ? null : anchorCreateWorker} placement={'bottom'} sx={{ boxShadow: 5, padding:"40px", width: isSmallScreen ? "70vw" : "340px", backgroundColor: "white", top: isSmallScreen ? '70px!important' : '20px!important', left: isSmallScreen ? '5vw!important' : 'auto' }}>
                    <Box  component="form" 
                        sx={{ 
                            backgroundColor: "white", 
                            width: "100%",
                            display: "flex", 
                            flexDirection: "column", 
                            padding: 0,
                            gap: 2 
                        }} 
                        padding={5} 
                        onSubmit={e => {
                            console.log("test")
                            e.preventDefault()
                            createWorker()
                        }}>
                        <TextField
                            required
                            id="worker_name"
                            label="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            required
                            id="worker_email"
                            label="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            required
                            id="worker_password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={createWorker}>
                            Create Worker
                        </Button>
                    </Box>
                </Popper>
                <Backdrop open={showAddWorkerForm} onClick={() => setShowAddWorkerForm(false)} />

                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {workers.map((worker, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={worker.name}
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                        >
                                        {worker.email}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    )
}

export default UsersList 