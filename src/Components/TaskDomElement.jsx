import React, { Component } from 'react'
import { Button, Panel, PanelGroup } from 'react-bootstrap'
import store from '../Reducers/appReducer'
import * as taskActions from '../Actions/taskActions'

class TaskDomElement extends Component {

    createSubTask() {
        store.dispatch(taskActions.setParentID(this.props.element._id))
        store.dispatch(taskActions.showForm(true))
    }

    render() {
        console.log(this.props.element)
        if (typeof this.props.element.subtasks === 'object') {
            return (
                <Panel>
                    <Button
                        bsSize="small"
                        disabled={store.getState().tasks.dirty}
                        className='small-add-button'
                        onClick={this.createSubTask.bind(this)}> + </Button>
                    <div> Name: {this.props.element.name}</div>
                    <div> Description: {this.props.element.description}</div>
                    <div> Created at: {this.props.element.created_at}</div>
                    {
                        this.props.element.subtasks.length > 0 ?
                            <PanelGroup>
                                {
                                    this.props.element.subtasks.map(function (elem, key) {
                                        {/* return <div key={key}>{elem.name}</div> */ }
                                        return <TaskDomElement key={key} element={elem} />
                                    })
                                }
                            </PanelGroup> : null
                    }
                </Panel>
            )
        } else {
            return <Panel>load data... </Panel>
        }
    }
}

export default TaskDomElement
