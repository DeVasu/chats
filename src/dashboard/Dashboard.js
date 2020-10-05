import React, { Component } from 'react';
import firebase from 'firebase'
import { Button, withStyles } from '@material-ui/core'
import styles from './styles'

import ChatList from '../chatList/ChatList'
import ChatView from '../chatView/ChatView'
import ChatTextBox from '../chatTextBox/ChatTextBox'
import NewChat from '../newChat/NewChat'

class Dashboard extends Component {
    
    state = {
        selectedChat: null,
        newChatFormVisible: false,
        email: null,
        chats: []
    }

    componentDidMount() {
        firebase
        .auth()
        .onAuthStateChanged(
            async _usr => {
            if(!_usr) 
                this.props.history.push('/login')
            else {
                await firebase
                        .firestore()
                        .collection('chats')
                        .where('users', 'array-contains', _usr.email)
                        .onSnapshot( async res => {
                            const chats = res.docs.map( _doc => _doc.data());
                            // console.log(chats)
                            await this.setState({
                                email: _usr.email,
                                chats
                            })
                            // console.log(this.state)
                        })
                        // console.log(this.state)
            }
            
        })
    }

    newChatBtnClicked = () => {
        this.setState({
            newChatFormVisible: true,
            selectedChat: null
        })
    }
    selectChat = (chatIndex) => {
        // console.log(this.state)
        // console.log(chatIndex)
        this.setState({selectedChat: chatIndex}, () => {
            console.log(this.state)
            this.messageRead()
        })
        // console.log(this.state)        
        // this.messageRead()
        // this.messageRead();
    }

    signOut = () => firebase.auth().signOut()

    buildDocKey = (friend) => [this.state.email, friend].sort().join(':')

    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
            .users.find( usr => usr !== this.state.email))
        
        firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                sender: this.state.email,
                message: msg,
                timestamp: Date.now()
            }),
            receiverHasRead: false
        })
    }

    clickedChatWhereNotSender = (chatIndex) => {
        return this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1]
            .sender !== this.state.email;
    }

    messageRead = () => {
        console.log(this.state)
        const chatIndex = this.state.selectedChat;
        // console.log(chatIndex)
        const docKey = this.buildDocKey(this.state.chats[chatIndex].users.find(usr => usr!==this.state.email))
        if(this.clickedChatWhereNotSender(this.state.selectedChat)) {
            firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update(
                { receiverHasRead: true}
            )
        } else {
            console.log('clicked for user===sender')
        }
    }

    goToChat = async (docKey, msg) => {
        const userInChat = docKey.split(':');
        const chat = this.state.chats.find( chat => userInChat.every(user=> chat.users.includes(user)))
        this.setState({ newChatFormVisible: false})
        await this.selectChat(this.state.chats.indexOf(chat));
        this.submitMessage(msg)
    }

    newChatSubmit = async (chatObj) => {
        const docKey = this.buildDocKey(chatObj.sendTo)
        await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .set({
                messages: [{
                    message: chatObj.message,
                    sender:this.state.email
                }],               
                receiverHasRead: false,
                users:[this.state.email, chatObj.sendTo]
            })
        this.setState({newChatFormVisible: false})
        this.selectChat(this.state.chats.length - 1)
    }
    
    render() {

        // console.log(`dashboard stat`)
        // console.log(this.state)

        const { classes } = this.props
        console.log(this.state)
        return (
            <div>
                {
                    // console.log(this.state)
                    this.state.chats.length>0?
                    <ChatList 
                        history={this.props.history}
                        newChatBtnFn = {this.newChatBtnClicked}
                        selectChatFn = {this.selectChat}
                        chats = {this.state.chats}
                        userEmail = {this.state.email}
                        selectedChatIndex = {this.state.selectedChat}
                    />:
                    null
                }
                {
                    this.state.newChatFormVisible ?
                    null:
                    <ChatView 
                        user={this.state.email}
                        chat={this.state.chats[this.state.selectedChat]}    
                    />
                }
                {
                    this.state.selectedChat !== null && !this.state.newChatFormVisible?
                    <ChatTextBox submitMessageFn = {this.submitMessage} messageReadFn={this.messageRead}/>:
                    null
                }
                {
                    this.state.newChatFormVisible ?
                    <NewChat 
                        goToChatFn = {this.goToChat}
                        newChatSubmitFn = {this.newChatSubmit}
                    />:
                    null
                }
                <Button onClick={this.signOut}
                    className={classes.signOutBtn}
                >
                    Sign Out
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);