import React from 'react'
import { Grid, Typography } from '@mui/material'
import { User } from '../types'

interface PrivateAreaProps {
    user: User
}

const PrivateArea: React.FC<PrivateAreaProps> = ({user}) => {

    return (
        <Grid container justifyContent="center" textAlign="center" direction={"column"} padding={5} sx={{ paddingTop: "150px" }}>
            <Typography component={"h1"} sx={{fontWeight:600, marginBottom: "20px"}}>Private Area</Typography>
            <Typography>{user.name}</Typography>
            <Typography>{user.birthday}</Typography>
            <Typography>{user.email}</Typography>
        </Grid>
    )
}

export default PrivateArea
