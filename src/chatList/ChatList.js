import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';

class ChatList extends React.Component {

    newChat = () => {
        console.log('newChat clicked')
        this.props.newChatBtnFn()
    }
    selectChat = index => {
        this.props.selectChatFn(index)
    }
    userIsSender = (chat) => chat.messages[chat.messages.length-1].sender === this.props.userEmail

    render() {

        console.log(this.props)
        console.log(this.props.chats[0].messages.message)

        const { classes } = this.props

        if(this.props.chats.length > 0) {
            return (
                <main className={classes.root}>
                    <Button variant="contained" fullWidth color="primary" 
                        onClick={this.newChat} className={classes.newChatBtn}
                    >New Message</Button>
                    <List>
                        {
                            this.props.chats.map( (chat, index) => {
                                return (<div key={index}>
                                    <ListItem
                                        onClick={() => this.selectChat(index)}
                                        className={classes.listItem}
                                        selected={this.props.selectedChatIndex === index}
                                        alignItems='flex-start'
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt='Remy Sharp'>
                                                {chat.users.find(user => user !== this.props.userEmail).split('')[0]}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={chat.users.find(user=> user!==this.props.userEmail)}
                                            secondary={
                                                <>
                                                <Typography component="span" color="textPrimary">
                                                    {
                                                        chat.messages[chat.messages.length - 1].message.substr(0,30)
                                                    }
                                                </Typography>
                                                </>
                                            }
                                        />
                                        {
                                            chat.receiverHasRead === false && !this.userIsSender(chat) ?
                                            <ListItemIcon>
                                                <NotificationImportant className={classes.unreadMessage} />
                                            </ListItemIcon>
                                            :null
                                        }
                                    </ListItem>
                                    <Divider />
                                
                                </div>)
                            })
                        }
                    </List>
                </main>
            ) 
        } else {
            return (
                <main className={classes.root}>
                    <Button variant='contained'
                        fullWidth
                        onClick = {this.newChat}
                        className={classes.newChat}
                    >
                    New Message
                    </Button>
                    <List />
                </main>
            )
        }
    }
}

export default withStyles(styles)(ChatList)