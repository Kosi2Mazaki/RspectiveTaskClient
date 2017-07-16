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
            }
        case taskActions.EXPAND_TASK:
            return {
                ...state,
                // entries: action.tasks.map(todo =>
                //     (todo === action.task.id) ?
                //         { ...todo, action.tasks.entry } : todo},
                // dirty: false
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
