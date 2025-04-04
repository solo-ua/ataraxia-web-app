import { setCurrentRadio } from "../actions/inServer-actions"

// create the reducer for client related in server - actions
const initialState = {
    status: 'Online',
    radio: {
        isStreaming: false,
        streaming: null,
    },
    serverSettings: {
        tasks:{
            private: false,
            title: 'To-do list for today',
            taskList:[
                {
                    name: 'Check comissions',
                    completed: false
                },
                {
                    name: 'Create new asset',
                    completed: false
                },
                {
                    name: 'Re-topologise the assets',
                    completed: false
                },
                {
                    name: 'Fix bone and mesh',
                    completed: false
                }
            ]
        } ,
        reminders: [{
            name: 'Set your first remidner!',
            time:45,
            notified: false,
        }],
        focusMode: 2000,
        timeout:5000,
    },
    currentPose: null,
    currentAvatar: null,
}
export const inServerReducer = (state = initialState, action) => { 
    switch(action.type) {
        case 'SET_STATUS': {
            return {
                ...state,
                status: action.payload,
            }
        }
        case 'SET_CURRENT_RADIO': {
            return {
                ...state,
                radio: {
                    isStreaming: true,
                    streaming: {
                        radio: action.payload.radio,
                        station: action.payload.station
                    },
                }
            }
        }
        case 'TURN_RADIO_OFF': {
            return {
                ...state,
                radio: {
                    isStreaming: false,
                    streaming: null,
                }
            }
        }
        case 'EDIT_TASK_TITLE': {
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    tasks: {
                        ...state.serverSettings.tasks,
                        title: action.payload,
                        private: state.serverSettings.tasks.private,
                    },
                },
            };
        }        
        case 'EDIT_TASK_PRIVACY': {
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    tasks: {
                        ...state.serverSettings.tasks,
                        title: state.serverSettings.tasks.title,
                        private: action.payload,
                    },
                },
            };
        }        
        case 'ADD_TASK': {
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    tasks: {
                        private: state.serverSettings.tasks.private,
                        title: state.serverSettings.tasks.title,
                        taskList: [
                            ...state.serverSettings.tasks.taskList,
                            {
                                name: action.payload,
                                completed: false,
                            }
                        ]
                    }
                }
            }
        }
        case 'COMPLETE_TASK': {
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    tasks: {
                        private: state.serverSettings.tasks.private,
                        title: state.serverSettings.tasks.title,
                        taskList: state.serverSettings.tasks.taskList.filter(
                            (task, index) => index !== action.payload // Remove the task at the specified index
                        ),
                    },
                },
            };
        }
        
        case 'ADD_REMINDER': {
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    reminders: [
                        ...state.serverSettings.reminders,
                        {
                            name: action.payload.name,
                            time: action.payload.time,
                            notified: false,
                        },
                    ],
                },
            };
        }
        case 'EDIT_REMINDER': { //needs index of the reminder
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    reminders: state.serverSettings.reminders.map((reminder, index) =>
                        index === action.payload.index
                            ? {
                                  ...reminder,
                                  name: action.payload.name ?? reminder.name,
                                  time: action.payload.time ?? reminder.time,
                                  notified: false,
                              }
                            : reminder
                    ),
                },
            };
        }
        case 'EDIT_FOCUS_MODE': {
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    focusMode: action.payload,
                },
            };
        }
        case 'EDIT_TIMEOUT': {
            return {
                ...state,
                serverSettings: {
                    ...state.serverSettings,
                    timeout: action.payload,
                },
            };
        }
        case 'SET_CURRENT_POSE' : {
            return {
                ...state,
                currentPose: action.payload,
            }
        }
        default:
        return state;
    }
}