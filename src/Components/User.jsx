import React, { Component } from 'react'
import { Control, Form, actions } from 'react-redux-form'
import * as userActions from '../Actions/userActions'
import * as alertActions from '../Actions/alertActions'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { requestProxy } from '../appconfig'
import { Link } from 'react-router-dom'
import store from '../Reducers/appReducer'

/**
 * Class responsible for user management.
 * Will show a login form when user is not logged in and
 * Username and logout button when user is logged in
 */
class UserForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            register: false
        }
    }

    /**
     * Used to login the user
     * @param {Object} user Object with user info
     */
    loginUser(user) {
        requestProxy.post('/authenticate',
            { name: user.username, password: user.password })
            .then(response => {
                //save token and username
                store.dispatch(userActions.logInUser({
                    username: user.username,
                    token: response.data
                }));
                // show info
                store.dispatch(
                    alertActions.setType(
                        alertActions.AlertType.INFO
                    ));
                store.dispatch(
                    alertActions.showAlert(
                        "You were successfully logged in."
                    ));
                // clear form
                store.dispatch(actions.reset('userForm.username'))
                store.dispatch(actions.reset('userForm.password'))
            }).catch((error) => {
                store.dispatch(
                    alertActions.setType(
                        alertActions.AlertType.ERROR
                    ));
                store.dispatch(
                    alertActions.showAlert(
                        error.response.status + ' (' + error.response.statusText + '): ' + error.response.data
                    ));
            });
    }
    /**
     * Used to create newuser
     * @param {Object} user Object with user info
     */
    registerUser(user) {
        requestProxy.post('/users',
            { name: user.username, password: user.password }).then(response => {
                // show info
                store.dispatch(
                    alertActions.setType(
                        alertActions.AlertType.INFO
                    ));
                store.dispatch(
                    alertActions.showAlert(
                        "User successfully created. You can now Login"
                    ));
                this.setState({ register: false })
                store.dispatch(actions.reset('userForm.username'))
                store.dispatch(actions.reset('userForm.password'))
            }).catch((error) => {
                this.showError(
                    error.response.status + ' (' + error.response.statusText + '): ' + error.response.data)
            });
    }

    showError(message) {
        store.dispatch(
            alertActions.setType(
                alertActions.AlertType.ERROR
            ));
        store.dispatch(
            alertActions.showAlert(
                message
            ));
    }

    /**
     * Used to handle form submission
     * @param {Object} user User object
     * @param {*} register Variable indicating if user should be created or registered
     */
    handleSubmit(user, register) {
        if (register) {
            this.registerUser(user)
        } else {
            this.loginUser(user)
        }
    }

    /**
     * Function used by redux-form to obtain dispatch object
     * @param {Object} dispatch 
     */
    attachDispatch(dispatch) {
        this.formDispatch = dispatch;
    }

    toggleRegister() {
        this.setState({ register: !this.state.register })
    }

    render() {
        if (!this.props.user.username) {

            return (
                < Form
                    model="userForm"
                    className="panelBody"
                    onSubmit={(userForm) => this.handleSubmit(userForm, this.state.register)}>
                    <Control.text
                        placeholder="Username"
                        model="userForm.username"
                        id="userForm.username" />
                    <Control.text
                        placeholder="Password"
                        type="password"
                        model="userForm.password"
                        id="userForm.password" />
                    <p>
                        <button type="submit" className="btn btn-primary">{this.state.register ? "Register" : "Login"}</button>
                    </p>
                    {
                        this.state.register ?
                            <p className="message" onClick={this.toggleRegister.bind(this)}>Already registered? <a>Sign In</a></p> :
                            <p className="message" onClick={this.toggleRegister.bind(this)}>Not registered? <a>Create an account</a></p>
                    }
                </Form >
            )
        } else {
            return (
                <div className="panelBody">
                    <div className="input">
                        Logged as: <b>{this.props.user.username}</b>
                    </div>
                    <Button
                        bsStyle="primary"
                        onClick={() => this.props.onUserLogout()}>
                        Logout
                    </Button>
                    <p className="extra-padding message">You can now go to the <Link to="/">Home</Link> page</p>
                </div>
            )
        }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUserLogout: () => {
            dispatch(userActions.logOutUser())
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserForm)
