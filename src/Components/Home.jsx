import React, { Component } from 'react'
import { requestProxy } from '../appconfig'
import { Button, Panel, PanelGroup } from 'react-bootstrap'
import * as alertActions from '../Actions/alertActions'
import * as taskActions from '../Actions/taskActions'
import { connect } from 'react-redux'
import TaskForm from './TaskForm'
import store from '../Reducers/appReducer'
import TaskDomElement from './TaskDomElement'

class Home extends Component {

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        requestProxy.get('/tasks', {
            params: {
                user: this.props.user.username,
            }
        }).then(response => {
            store.dispatch(taskActions.storeTasks(response.data))
        }).catch((error) => {
            this.showMessage(
                alertActions.AlertType.ERROR,
                error.response.status + ' (' + error.response.statusText + '): ' + error.response.data
            )
        });
    }

    createTask(doShow) {
        this.props.showTagForm(doShow)
        this.fetchData()
    }

    showMessage(type, message) {
        store.dispatch(
            alertActions.setType(
                type
            ));
        store.dispatch(
            alertActions.showAlert(
                message
            ));
    }

    render() {
        return (
            <div className="modal-container">
                <Panel header="Manage main tasks">
                    <Button
                        bsSize="small"
                        onClick={this.createTask.bind(this, true)}
                    > Add new task </Button>
                </Panel>
                <TaskForm />
                <PanelGroup>
                    {
                        this.props.tasks.entries.map(function (elem, key) {
                            if (elem.root) {
                                return <TaskDomElement key={key} isDefaultOpen element={elem} />
                            }
                        })
                    }
                </PanelGroup>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        tasks: state.tasks
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAlertType: (type) => {
            dispatch(alertActions.setType(type))
        },
        showAlert: (message) => {
            dispatch(alertActions.showAlert(message))
        },
        showTagForm: (doShow) => {
            dispatch(taskActions.showForm(doShow))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
