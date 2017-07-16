import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Control, Form, actions } from 'react-redux-form'
import { connect } from 'react-redux'
import * as taskActions from '../Actions/taskActions'
import { requestProxy } from '../appconfig'
import * as alertActions from '../Actions/alertActions'
import store from '../Reducers/appReducer'

class TaskForm extends Component {

    handleSubmit(newTaskFormData) {
        if (store.getState().tasks.dirty) {
            this.showMessage(
                alertActions.AlertType.ERROR,
                "The application is in dirty state. Please refresh!"
            )
            return
        }

        var dispatcher = this.formDispatch;
        store.dispatch(taskActions.showForm(false))
        this.clearForm()
        if (store.getState().tasks.parentID) {
            console.log("Subtask")
            this.createTask(newTaskFormData, "/" + store.getState().tasks.parentID)
        } else {
            this.createTask(newTaskFormData)
        }
    }

    /**
     * Uset to create tasks or subtasks
     * @param {*} newTaskFormData data used to cratea new task
     * @param {String} extraRequest will determine if we want to create a task or subtask
     */
    createTask(newTaskFormData, extraRequest = "") {
        requestProxy.post('/tasks' + extraRequest,
            {
                name: newTaskFormData.name,
                description: newTaskFormData.description,
                owner: this.props.user.username
            })
            .then(response => {
                this.showMessage(
                    alertActions.AlertType.Info,
                    "Task called '" + newTaskFormData.name + "' created successfully"
                )
                store.dispatch(taskActions.setDirty())
            }).catch((error) => {
                this.showMessage(
                    alertActions.AlertType.ERROR,
                    error.response.status + ' (' + error.response.statusText + '): ' + error.response.data
                )
            });
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

    /**
     * Used to clear all fields values for the next use
     */
    clearForm() {
        store.dispatch(actions.reset('newTaskForm.name'))
        store.dispatch(actions.reset('newTaskForm.description'))
    }

    /**
     * Used to cancel the submit, thus clear fields and close the form
     */
    cancelSubmin() {
        this.clearForm()
        store.dispatch(taskActions.showForm(false))
    }

    render() {
        let close = () => this.setState({ show: false });
        return (
            <div className="modal-container">
                <Modal
                    show={this.props.tasks.showForm}
                    onHide={close}
                    container={this}>
                    <Modal.Body>
                        < Form
                            model="newTaskForm"
                            className="modalBody"
                            onSubmit={(newTaskForm) => this.handleSubmit(newTaskForm)}>

                            <label> ParentID: {this.props.tasks.parentID} </label>
                            <Control.text
                                placeholder="Task name"
                                model="newTaskForm.name"
                                id="newTaskForm.name" />
                            <Control.text
                                placeholder="Task description"
                                model="newTaskForm.description"
                                id="newTaskForm.description" />
                            <p>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </p>
                            <p>
                                <Button
                                    className="btn btn-primary"
                                    onClick={this.cancelSubmin.bind(this)}>Cancel</Button>
                            </p>
                        </Form >
                    </Modal.Body>
                </Modal>
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        tasks: state.tasks,
        user: state.user
    }
}

export default connect(
    mapStateToProps
)(TaskForm)
