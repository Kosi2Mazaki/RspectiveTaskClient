import React, { Component } from 'react'
import { Button, Panel, PanelGroup, ButtonGroup, Popover, OverlayTrigger } from 'react-bootstrap'
import store from '../Reducers/appReducer'
import * as taskActions from '../Actions/taskActions'
import { requestProxy } from '../appconfig'
import * as alertActions from '../Actions/alertActions'
import { connect } from 'react-redux'
import * as commonActions from '../Actions/commonActions'

const popoverHoverFocusAdd = (
    <Popover id="popover-trigger-hover-focus" title="Popover bottom">
        Use to <strong>add</strong> new subtask to the task
  </Popover>
);

const popoverHoverFocusCheck = (
    <Popover id="popover-trigger-hover-focus" title="Popover bottom">
        Use to check the task as <strong>DONE</strong>
    </Popover>
);

const popoverHoverFocusUnCheck = (
    <Popover id="popover-trigger-hover-focus" title="Popover bottom">
        Use to check the task as <strong>not DONE</strong>
    </Popover>
);

const popoverHoverFocusRemove = (
    <Popover id="popover-trigger-hover-focus" title="Popover bottom">
        Use to <strong>remove</strong> a task
  </Popover>
);

class TaskDomElement extends Component {

    /**
     * Used to create a subtask
     */
    createSubTask() {
        store.dispatch(taskActions.setParentID(this.props.element._id))
        store.dispatch(taskActions.showForm(true))
    }

    /**
     * Used to update task state
     * @param {Object} task Updated task to be sent to the DB
     * @param {*} status Status to set on task's field done
     */
    markTaskDone(task, status) {
        requestProxy.put('/tasks/' + task._id,
            {
                name: task.name,
                description: task.description,
                done: status
            })
            .then(response => {
                commonActions.showMessage(
                    alertActions.AlertType.Info,
                    "Task updated successfully"
                )
                commonActions.fetchData()
            }).catch((error) => {
                commonActions.showMessage(
                    alertActions.AlertType.ERROR,
                    error.response.status + ' (' + error.response.statusText + '): ' + error.response.data
                )
            });
    }

    /**
     * Used to remove tasks
     * @param {Object} task Task to be removed
     */
    removeTask(task) {
        requestProxy.delete('/tasks/' + task._id,
        )
            .then(response => {
                commonActions.showMessage(
                    alertActions.AlertType.Info,
                    "Task removed successfully"
                )
                commonActions.fetchData()
            }).catch((error) => {
                commonActions.showMessage(
                    alertActions.AlertType.ERROR,
                    error.response.status + ' (' + error.response.statusText + '): ' + error.response.data
                )
            });
    }

    render() {
        var objToRender = (typeof this.props.element !== 'string') ?
            this.props.element :
            store.getState().tasks.entries.filter((value) => {
                return value._id === this.props.element
            })[0]
        var allTasks = store.getState().tasks.entries
        // Get all tasks in progress -> will be on top
        var tasksInProgress = objToRender.subtasks.filter((element) => {
            let tt = allTasks.filter((elemList) => {
                return elemList._id === element && !elemList.done
            })

            return tt.length
        })
        // Get all tasks done -> will be moved to the bottom of the list
        var tasksDone = objToRender.subtasks.filter((element) => {
            let tt = allTasks.filter((elemList) => {
                return elemList._id === element && elemList.done
            })

            return tt.length
        })
        return (
            <Panel
                collapsible
                defaultExpanded={this.props.isDefaultOpen ? true : false}
                header={objToRender.done ? "Done: " + objToRender.name : objToRender.name}
                bsStyle={objToRender.done ? "success" : "default"}>

                <div className={objToRender.done ? "cross-text" : null}> {objToRender.description}</div>
                <div className={objToRender.done ? "cross-text" : null}> Created at: {objToRender.created_at}</div>
                <ButtonGroup className="add-top-padding">
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={popoverHoverFocusAdd}>
                        <Button
                            bsSize="small"
                            className='small-add-button'
                            onClick={this.createSubTask.bind(this)}>                         +                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={popoverHoverFocusCheck}>
                        <Button
                            bsSize="small"
                            className='small-add-button'
                            bsStyle="success"
                            onClick={this.markTaskDone.bind(this, objToRender, true)}> ✔ </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={popoverHoverFocusUnCheck}>
                        <Button
                            bsSize="small"
                            className='small-add-button'
                            bsStyle="warning"
                            onClick={this.markTaskDone.bind(this, objToRender, false)}> ✖ </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        overlay={popoverHoverFocusRemove}>
                        <Button
                            bsSize="small"
                            className='small-add-button'
                            bsStyle="danger"
                            onClick={this.removeTask.bind(this, objToRender)}> - </Button>
                    </OverlayTrigger>
                </ButtonGroup>
                {
                    (tasksInProgress.length > 0 || tasksDone.length > 0) ?
                        <div>
                            <PanelGroup className="add-top-padding" defaultActiveKey="1" accordion>
                                {

                                    tasksInProgress.map(function (elem, key) {
                                        return <TaskDomElement key={key} element={elem} />
                                    })
                                }
                                {

                                    tasksDone.map(function (elem, key) {
                                        return <TaskDomElement key={key} element={elem} />
                                    })
                                }
                            </PanelGroup>
                        </div>
                        : null
                }
            </Panel >
        )
    }
}


export default TaskDomElement
