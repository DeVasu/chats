import React from 'react'
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core'
import styles from './styles'
import firebase from 'firebase'

class NewChat extends React.Component {

    state = {
        username:null,
        message:null
        // serverError: false
    }

    userTyping = (type, e) => {
        this.setState({[type]:e.target.value })
    }

    submitNewChat = async (e) => {
        e.preventDefault()

        const userExists = await this.userExists();
        if(userExists) {
            const chatExists = await this.chatExists();
            const chatObj = {
                sendTo: this.state.username,
                message: this.state.message
            }
            chatExists ?
            this.props.goToChatFn(this.buildDocKey(), this.state.message):
            this.props.newChatSubmitFn(chatObj)
            // this.goToChat(): this.createChat()

        }
        // const user = 
    }

    createChat = () => {
        this.props.newChatSubmitFn({
            sendTo: this.state.username,
            message: this.state.message
        })
    }

    goToChat = () => {this.props.goToChatFn(this.buildDocKey(), this.state.message)}

    buildDocKey = () => {
        return [firebase.auth().currentUser.email, this.state.username].sort().join(':')
    }

    chatExists = async () => {
        const docKey = this.buildDocKey();
        const chat = await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .get();
        console.log(chat.exists)
        return chat.exists;

    }

    userExists = async () => {
        const userSnapshot = await firebase
            .firestore()
            .collection('users')
            .get();
        const exists = userSnapshot.docs
            .map(doc => doc.data().email)
            .includes(this.state.username)
        // this.setState( {serverError: !exists})
        return exists;
    }

    render() {

        const { classes } = this.props

        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">Send A Message!</Typography>
                    <form className={classes.form} onSubmit={e=>this.submitNewChat(e)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="new-chat-username">
                                Enter Your Friend's Email
                            </InputLabel>
                            <Input 
                                type="email" required 
                                className={classes.input} autoFocus 
                                onChange={e=> this.userTyping('username', e)}
                                id='new-chat-username'
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-message'>Enter Your Message</InputLabel>
                            <Input required 
                                className={classes.input}
                                onChange = {e=> this.userTyping('message', e)}
                                id='new-chat-message'
                            />
                        </FormControl>
                        <Button type="submit" fullWidth className={classes.submit} variant="contained">
                            Submit
                        </Button>
                    </form>
                </Paper>
            </main>
        )
    }
}

export default withStyles(styles)(NewChat)