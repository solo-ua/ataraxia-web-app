export const setStatus = (status) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'SET_STATUS',
                payload: status,
            }
        )
    }catch(e){
        console.error('Failed to update the status: ' + e)
    }
}
/*
Save both radio and station if needed in future. to sync, set up an emitter on sync
that emitter will return the inServerUserData.currentRadio of that player. Once recieved locally
the user will dispatch play(radio,station) action from the radio-actions.js
and it will sync their info
so you need to update this later
*/ 
export const setCurrentRadio = (radio,station) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'SET_CURRENT_RADIO',
                payload: {
                    radio: radio,
                    station: station,
                },
            }
        )
    }catch(e){
        console.error('Failed to update the radio: ' + e)
    }
}
export const turnRadioOff = () => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'TURN_RADIO_OFF',
            }
        )
    }catch(e){
        console.error('Failed to turn radio off: ' + e)
    }
}
export const addTask = (taskName) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'ADD_TASK',
                payload: taskName,
            }
        )
    }catch(e){
        console.error('Failed to add task: ' + e)
    }
}
export const editTaskTitle = (taskTitle) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'EDIT_TASK_TITLE',
                payload: taskTitle,
            }
        )
    }catch(e){
        console.error('Failed to add task: ' + e)
    }
}
export const editTaskPrivacy = (privacy) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'EDIT_TASK_PRIVACY',
                payload: privacy,
            }
        )
    }catch(e){
        console.error('Failed to add task: ' + e)
    }
}
export const completeTask = (taskIndex) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'COMPLETE_TASK',
                payload: taskIndex,
            }
        )
    }catch(e){
        console.error('Failed to mark task as completed: ' + e)
    }
}
// edit if needed;
export const addReminder = (reminderName, reminderDue) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'ADD_REMINDER',
                payload: {
                    name: reminderName,
                    time: reminderDue,
                },
            }
        )
    }catch(e){
        console.error('Failed to add reminder: ' + e)
    }
}

export const editFocusMode = (focusModeDuration) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'EDIT_FOCUS_MODE',
                payload: {
                    focusModeDuration,
                },
            }
        )
    }catch(e){
        console.error('Failed to edit focus mode duration: ' + e)
    }
}

export const editTimeout = (timeoutDuration) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'EDIT_TIMEOUT',
                payload: timeoutDuration,
            }
        )
    }catch(e){
        console.error('Failed to edit timeout duration: ' + e)
    }
}
export const setCurrentPose = (currentPoseIndex) => (dispatch) => { 
    try{
        dispatch(
            {
                type: 'SET_CURRENT_POSE',
                payload: currentPoseIndex
            }
        )
    }catch(e){
        console.error('Failed to edit timeout duration: ' + e)
    }
}

