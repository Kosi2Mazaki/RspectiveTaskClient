import { requestProxy } from '../appconfig'
import store from '../Reducers/appReducer'
import * as alertActions from '../Actions/alertActions'
import * as taskActions from '../Actions/taskActions'

export function showMessage(type, message) {
    store.dispatch(
        alertActions.setType(
            type
        ));
    store.dispatch(
        alertActions.showAlert(
            message
        ));
}


export function fetchData() {
    requestProxy.get('/tasks', {
        params: {
            user: store.getState().user.username,
        }
    }).then(response => {
        let responseArr = response.data
        store.dispatch(taskActions.storeTasks(response.data))
    }).catch((error) => {
        showMessage(
            alertActions.AlertType.ERROR,
            error.response.status + ' (' + error.response.statusText + '): ' + error.response.data
        )
    });
}
