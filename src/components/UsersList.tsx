import { Grid, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'

interface UsersListProps {
    onAddWorker: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ onAddWorker }) => {
    return (
        <Grid container justifyContent="center" textAlign="center" padding={5}>
            <Grid item>
                <Button sx={{ padding:"10px" }} onClick={onAddWorker}>
                    <PersonAddAltIcon sx={{marginRight:"20px"}} />
                    <Typography>Add Worker</Typography>
                </Button>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                        primary="Brunch this weekend?"
                        secondary={
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                                >
                                Ali Connors
                            </Typography>
                        }
                        />
                    </ListItem>
                </List>
            </Grid>
        </Grid>
    )
}

export default UsersList 