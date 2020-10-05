import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import withStyles from '@material-ui/core/styles/withStyles'
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import firebase from 'firebase'
import styles from './styles'
import { Link } from 'react-router-dom'

class SignUp extends Component {

    state = {
        email: null,
        password: null,
        passwordConfirmation: null,
        signupError: ''
    }

    formIsValid = () => this.state.password === this.state.passwordConfirmation

    submitSignup = (e) => {
        e.preventDefault();

        if(!this.formIsValid()) {
            this.setState({
                signupError: "Passwords do not Match!"
            })
            return
        }

        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then( authRes => {
            const userObj = {
                email: authRes.user.email
            };
            firebase
            .firestore()
            .collection('users')
            .doc(this.state.email)
            .set(userObj)
            .then( () => {
                this.props.history.push('/dashboard');
            }, dbErr => {
                console.log(dbErr);
                this.setState({signupError: 'Failed to add user in db'});
            })
        }, authErr => {
            console.log(authErr);
            this.setState({signupError: 'Failed to add user'})
        })

    }

    userTyping = (type, e) => {
        switch(type) {
            case 'email':
                this.setState({ email: e.target.value})
                break
            case 'password':
                this.setState({ password: e.target.value})
                break
            case 'passwordConfirmation':
                this.setState({passwordConfirmation: e.target.value})
                break;
            default:
                break;
        }

    }

    render() {

        const { classes } = this.props

        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Sign Up!
                    </Typography>
                    <form onSubmit={(e) => this.submitSignup(e) } className={classes.form}>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="signup-email-input">
                                Enter Your Email
                            </InputLabel>
                            <Input autoComplete='email' autoFocus id="signup-email-input" 
                                onChange={(e) => this.userTyping('email', e)}
                            />
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="signup-password-input">Create a Password</InputLabel>
                            <Input type="password" id="signup-password-input"
                                onChange={e=>this.userTyping('password',e)} 
                            />
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor="signup-password-confirmation-input">Confirm Your Password</InputLabel>
                            <Input type="password" id="signup-password-confirmation-input"
                                onChange={e=>this.userTyping('passwordConfirmation',e)} 
                            />
                        </FormControl>
                        <Button type='submit' fullWidth variant='contained' color='primary'
                            className={classes.submit}>Submit</Button>                    
                    </form>
                    {
                        this.state.signupError ? 
                            <Typography className={classes.errorText} component="h5" variant="h6">
                                {this.state.signupError}
                            </Typography>
                            :
                            null

                    }
                    <Typography component="h5" variant="h6" className={classes.hasAccountHeader}>
                        Already Have an Account ?
                    </Typography>
                    <Link to="/login" className={classes.logInLink}>Log In!</Link>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(SignUp);