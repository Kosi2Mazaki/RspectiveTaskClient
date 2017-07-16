export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_ACTIVE: 'SHOW_ACTIVE',
    SHOW_COMPLETE: 'SHOW_COMPLETE'
}

export function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter }
}

export const SET_PARENT_ID = "SET_PARENT_ID"
export const TOGGLE_TASK_FORM = "TOGGLE_TASK_FORM"
export const STORE_TASKS = "STORE_TASKS"
export const SET_DIRTY = "SET_DIRTY"

export function showForm(doShow) {
    return { type: TOGGLE_TASK_FORM, doShow }
}

export function setParentID(newId) {
    return { type: SET_PARENT_ID, newId }
}

export function storeTasks(tasks) {
    return { type: STORE_TASKS, tasks }
}

export function setDirty() {
    return { type: SET_DIRTY }
}
