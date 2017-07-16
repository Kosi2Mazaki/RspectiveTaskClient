import { combineReducers } from 'redux'
import { visibilityFilter, tasks } from './taskReducer'
import user from './userReducer'
import alert from './alertReducer'
import { combineForms } from 'react-redux-form'
import { createStore } from 'redux';

/**
 * Creates a Redux storage
 */
const store = createStore(combineReducers({
    alert,
    visibilityFilter,
    user,
    tasks,
    userForm: combineForms({
        username: "",
        password: ""
    }, 'userForm'),
    newTaskForm: combineForms({
        name: "",
        description: ""
    }, 'newTaskForm')
}));

let next = store.dispatch
store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}
let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);
unsubscribe();

export default store;
