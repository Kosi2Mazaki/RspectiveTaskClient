import * as taskActions from '../Actions/taskActions'

const { SHOW_ALL } = taskActions.VisibilityFilters;

export function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case taskActions.SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state;
    }
}

const initialTaskState = {
    showForm: false,
    parentID: "",
    dirty: false,
    entries: []
}
export function tasks(state = initialTaskState, action) {
    switch (action.type) {
        case taskActions.TOGGLE_TASK_FORM:
            return {
                ...state,
                showForm: action.doShow
            }
        case taskActions.STORE_TASKS:
            return {
                ...state,
                entries: action.tasks,
                dirty: false
            }
        case taskActions.SET_DIRTY:
            return {
                ...state,
                dirty: true,
                parentID: ""
            }
        case taskActions.SET_PARENT_ID:
            return {
                ...state,
                parentID: action.newId
            }
        default:
            return state
    }

}
