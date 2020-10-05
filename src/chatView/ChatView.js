import React from 'react'
import styles from './styles'
import { withStyles } from '@material-ui/core'

class ChatView extends React.Component {

    componentDidUpdate() {
        const container = document.getElementById('chatView-container');
        if(container) {
            container.scrollTo(0, container.scrollHeight)

        }
    }

    render() {

        const { classes, chat, user } = this.props
        if(chat === undefined) {
            return (
                <main className={classes.content}></main>
            )
        } else {
            return (
                <div>
                    <div className={classes.chatHeader}>
                        Your Conversation with {(chat.users.find(usr => usr !== user)).split('@')[0]}
                    </div>
                    <main className={classes.content} id="chatView-container">
                        {
                            chat.messages.map( (msg, index) => (
                                <div key={index} className={msg.sender === user ? classes.userSent: classes.friendSent}>
                                    {msg.message}
                                </div>
                            ))
                        }
                    </main>

                </div>
            )
        }

    }
}

export default withStyles(styles)(ChatView)