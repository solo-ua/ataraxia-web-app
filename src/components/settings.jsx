import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  editFocusMode,
  editTaskPrivacy,
  editTimeout,
  setStatus,
} from '../redux/actions/inServer-actions';
import { setFriendListPrivacy } from '../redux/actions/user-actions';
import '../style/settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Privacy');
  const privTaskListRef = useRef();
  const privFriendListRef = useRef();
  const statusRef = useRef();
  const focusDurationRef = useRef();
  const timeoutDurationRef = useRef();
  const dispatch = useDispatch();

  const saveSettings = () => {
    switch (activeTab){
        case 'Privacy':{
            dispatch(editTaskPrivacy(privTaskListRef.current.checked));
            dispatch(setFriendListPrivacy(privFriendListRef.current.checked));

        }break;
        case 'Server':{
            dispatch(editFocusMode(focusDurationRef.current.value));
            dispatch(editTimeout(timeoutDurationRef.current.value));
            dispatch(setStatus(statusRef.current.value));
        };break
    }
  };

  return (
    <div>
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
              Focus duration
              <input
                type="number"
                ref={focusDurationRef}
                defaultValue={3500}
                className="duration-input"
              />
            </label>
            <label>
              Timeout duration
              <input
                type="number"
                ref={timeoutDurationRef}
                defaultValue={500}
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
