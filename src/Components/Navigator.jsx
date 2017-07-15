import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import store from '../Reducers/appReducer'


/**
 * Used to block navigation when user is not authorized.
 * Just wrap the Route with Navigator
 */
export default Navigator = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        store.getState().user.username ? (
            <Component {...props} />
        ) : (
                <Redirect to={{
                    pathname: '/user',
                    state: { from: props.location }
                }} />
            )
    )} />
)
