import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField'
import Send from '@material-ui/icons/Send'
import styles from './styles'
import { withStyles } from '@material-ui/core/styles'

class ChatTextBox extends Component {

    state = {
        chatText:''
    }

    userTyping = e => {
        if(e.keyCode === 13) {
            this.submitMessage()
        } else {
            this.setState({
                chatText: e.target.value
            })
        }
    }
    userClickedInput = () => {
        this.props.messageReadFn();
    }
    submitMessage = () => {
        if(this.messageValid(this.state.chatText)) {
            //call parent function
            this.props.submitMessageFn(this.state.chatText)
            document.getElementById('chattextbox').value = ''
        }
    }
    messageValid = txt => txt && txt.replace(/\s/g, '').length 

    render() {

        const { classes } = this.props

        return (
            <div className={classes.chatTextBoxContainer}>
                <TextField placeholder="Enter a message..."
                    onKeyUp={e => this.userTyping(e)}
                    id='chattextbox'
                    className={classes.chatTextBox}
                    onFocus={this.userClickedInput}
                />
                <Send onClick={this.submitMessage} className={classes.sendBtn} />
            </div>
        );
    }
}

export default withStyles(styles)(ChatTextBox);