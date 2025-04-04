import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  editFocusMode,
  editTaskPrivacy,
  editTimeout,
  setStatus,
} from '../redux/actions/inServer-actions';
import { setFriendListPrivacy } from '../redux/actions/user-actions';
import '../style/settings.css'
import AlertMessage from './minor-components/top-popup-alert';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Privacy');
  const privTaskListRef = useRef();
  const privFriendListRef = useRef();
  const statusRef = useRef();
  const focusDurationRef = useRef();
  const timeoutDurationRef = useRef();
  const focusDuration = useSelector((state)=> state.inServer.serverSettings.focusMode);
  const timeoutDuration = useSelector((state)=> state.inServer.serverSettings.timeout);
  const dispatch = useDispatch();
  const [alert,setAlert] = useState({alert: false, message:'',type:'success'});


  const saveSettings = () => {
    switch (activeTab){
        case 'Privacy':{
            dispatch(editTaskPrivacy(privTaskListRef.current.checked));
            dispatch(setFriendListPrivacy(privFriendListRef.current.checked));
          }break;
          case 'Server':{
            dispatch(editFocusMode(focusDurationRef.current.value * 60 * 1000));
            dispatch(editTimeout(timeoutDurationRef.current.value * 60 * 1000));
            dispatch(setStatus(statusRef.current.value));
          };break
        }
        setAlert({alert:true,type:'success',message:'Settings updated'});
      };

  return (
    <div>
      {alert.alert && (<AlertMessage message={alert.message} onClose={() => setAlert({ alert: false, message: '', type: '' })}  type={alert.type}/>)}
      <div className="tab-container">
        <div className="tab-header">
          <button
            className={`tab-button ${activeTab === 'Privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('Privacy')}
          >
            Privacy
          </button>
          <button
            className={`tab-button ${activeTab === 'Server' ? 'active' : ''}`}
            onClick={() => setActiveTab('Server')}
          >
            Server Settings
          </button>
        </div>

        {activeTab === 'Privacy' && (
          <div className="tab-content">
            <h2>Privacy</h2>
            <label>
              Set tasks as private
              <input
                type="checkbox"
                ref={privTaskListRef}
                className="setting-toggle"
              />
            </label>
            <label>
              Make friend list private
              <input
                type="checkbox"
                ref={privFriendListRef}
                className="setting-toggle"
              />
            </label>
          </div>
        )}

        {activeTab === 'Server' && (
          <div className="tab-content">
            <h2>Server Settings</h2>
            <label>
              Set status
              <select name="status" ref={statusRef} defaultValue="Online">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Open to chatting">Open to chatting</option>
                <option value="Needs assistance">Needs assistance</option>
                <option value="Open to assist">Open to assist</option>
                <option value="Do not disturb">Do not disturb</option>
              </select>
            </label>
            <label>
              Focus duration (min)
              <input
                type="number"
                ref={focusDurationRef}
                defaultValue={focusDuration / 1000 / 60}
                className="duration-input"
              />
            </label>
            <label>
              Timeout duration (min)
              <input
                type="number"
                ref={timeoutDurationRef}
                defaultValue={timeoutDuration / 1000 / 60}
                className="duration-input"
              />
            </label>
          </div>
        )}

        <button onClick={saveSettings} className="save-button">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
