/*
  This component consists of many minor componenets that make-up the server 
  function and features. Such as:
    - Task bar
    - Chat side-bar
    - Server info side-bar
    - Profile info pop-up 
*/ 
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../style/inServer.css'
import userEmitter from '../userEmitter.js'
import socket from '../../socket.js';
import { addTask, completeTask } from '../../redux/actions/inServer-actions.js';
import Radio from './radio.jsx';
// TODO SYNC PROPERLY WHEN AUDIO CHANGES USING SOCKET EMITTER!!



const TaskWindow = () => {
  const tasks = useSelector((state) => state.inServer.serverSettings.tasks);
  const dispatch = useDispatch();
  const [completedTasks, setCompletedTasks] = useState([]);
  const timeoutsRef = useRef({});

  const handleTask = (e, newTask) => {
    if(newTask.trim()){
      e.currentTarget.value  = '';
      dispatch(addTask(newTask));
    }
  };

  const handleCheck = (e, index) => {
    if (e.target.checked) {
      setCompletedTasks((prev) => [...prev, index]);

      const timeoutId = setTimeout(() => {
        dispatch(completeTask(index)); // Remove task after 5 seconds
        setCompletedTasks((prev) => prev.filter((i) => i !== index)); //remove it from completed
      }, 2000); // 5 seconds after checked

      timeoutsRef.current[index] = timeoutId;
    } else {
      // if unchecked, cancel the timeout and prevent further action
      clearTimeout(timeoutsRef.current[index]);

      // remove the task from the completed list if it's unchecked before the action completes
      setCompletedTasks((prev) => prev.filter((i) => i !== index));

      // clear the timeout stored for that task
      delete timeoutsRef.current[index];
    }
  };

  return (
    <div>
      <div className="task-container">
        {tasks?.taskList?.length > 0 ? (
          tasks.taskList.map((task, index) => (
            <div
              key={index}
              className={`task ${
                completedTasks.includes(index) ? 'completed' : ''
              }`}
            >
              <input
                className="task-checkbox"
                type="checkbox"
                id={`c-${task.id}`}
                checked={completedTasks.includes(index)} 
                onChange={(e) => handleCheck(e, index)} 
              />
              <div className="task-title">{task.name}</div>
            </div>
          ))
        ) : (
          <i className='mock'>Have you finished your to-do list already?</i>
        )}
      </div>

      <input
        maxLength={40}
        className="add-task-input-container"
        placeholder="Type in a new task..."
        onKeyDown={(e) => e.key === 'Enter' && handleTask(e, e.currentTarget.value)}
      />
    </div>
  );
};

const Chat = ({ messages, setMessages }) => {
  const server = useSelector((state) => state.server.server);
  const nickname = useSelector((state) => state.user.nickname);
    // Common states across all micro-components:
    const [messageInput, setMessageInput] = useState(""); // Input message saved as draft
  
  // const [messages, setMessages] = useState([]); // Track all messages (sent and received)

  // Handle sending a message
  const sendMessage = () => {
    if (!messageInput.trim()) return; // Avoid sending empty messages
  
    // Emit the message via socket
    socket.emit("sendMessage", { roomId: server.id, sender: nickname, message: messageInput });
    console.log('messages:',messages);
    // Add the message to the local state
    setMessages((prev) => [
      ...prev,
      { type: "sent", sender: nickname, message: messageInput },
    ]);
  
    // Clear the input field
    setMessageInput("");
  };

  // Load previous messages
  const loadMessages = () => { 

   }
  return (
    <div className="tab-chat">
    {/* Chat content stays at the top */}
    <div className="chat-content">
      {messages.map((msg, index) => (
        <>
          {msg.type === "received" && <i className='sender-nick'>{msg.sender}</i>} 
          <div
            className={`chatbubble ${msg.type === "sent" ? "sender" : ""}`}
            key={`msg-${index}`}
            >
            {msg.message}
          </div>
          </>
      ))}
    </div>
  
    {/* Input stays at the bottom */}
      <input
        className="inp-chat"
        placeholder="Type a message"
        value={messageInput}
        maxLength={1000}
        onChange={(e) => setMessageInput(e.target.value)} // Handle input changes
        onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send on Enter key
      />
  </div>  
  );
};

const People = () => {
  const server = useSelector((state) => state.server.server);
  const handleUserClick = (user) => {
    userEmitter.emit("selectUser", user); // select the user and send it
  };

  return (
    <div className="tab-peopleInServer">
      {server?.userData?.length > 0 ? (
        server.userData.map((user, index) => (
          <div className="user" key={index} onClick={() => handleUserClick(user)}>
            <img src="https://picsum.photos/200" alt="profile pic" className="pfp-s" />
            <div className="user-info-nick">{user.nickname}</div>
            <div className="user-info-status">{user.status}</div>
          </div>
        ))
      ) : (
        <p className='mock'>... looks like you're here all by yourself.</p>
      )}
    </div>
  );
};

const ProfilePopUp = ({ user, onClose }) => {
  if (!user) return null;
  const [closing, setClosing] = useState(false);
  const sendTaskList = () => { 
    userEmitter.emit("selectUserTask",user.tasks)
  }
  const sendRadioPopUp = () => { 
    userEmitter.emit("selectUserRadio",user.radio)
  }
  const close = () => {
    setClosing(true); // Trigger the slide-down animation
    onClose();
  }
  
  const handleProfile = (user) => {
    
  }

  return (
    <div
    className={`profile-popUp ${closing ? "slideDown" : "slideUp"}`}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the pop-up
    >
      <div className="profile-content">
        <button onClick={sendRadioPopUp}>🎵</button> 
        {
          user.tasks.private?(null):<button onClick={sendTaskList}>☷</button> // hide the button if tasks are private
        }
        <button className="close-btn" onClick={close}>
          × 
        </button>
        <img src="https://picsum.photos/200" alt="profile pic" className="pfp-s" onCanPlay={(e) => { handleProfile(user) }}/>
        <div className="user-info-nick">{user.nickname}</div>
        <div className="user-info-username">{user.username}</div>
        <div className="user-info-status">{user.status}</div>
        <div className="user-info-datJoined">
          Member since | {user.dateJoined}
        </div>
        <div className="user-info-about">{user.about}</div>
      </div>
    </div>
  );
};

const TaskPopUp = ({ task, onClose }) => {
  if (!task) return null;
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true); // Trigger the slide-out animation
    setTimeout(onClose, 500); // Delay to allow animation to finish
  };

  return (
    <div
      className={`task-popUp-wrapper ${closing ? "closing" : "opening"}`}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the pop-up
    >
      <div className="task-popUp">
        <button className="close-btn" onClick={close}> × </button>
        <div className="task-title">{task.title}</div>
        {task.taskList?.length > 0 ? (
          task.taskList.map((task, index) => (
            <div key={index} className="task-name">{task.name}</div>
          ))
        ) : (
          <p>No tasks available</p> // Optional: Display message when no tasks
        )}
      </div>
    </div>
  );
};

const RadioPopUp = ({ radio, onClose }) => {
  if (!radio) return null
  const [closing, setClosing] = useState(false);
  
  const syncRadio = (radio,station) => { 
    console.log('sent data', radio, station);
    userEmitter.emit('sync_radio', radio,station);
   }
  const close = () => {
    setClosing(true); // Trigger the slide-out animation
    setTimeout(onClose, 500); // Delay to allow animation to finish
  };

  return (
    <div
      className={`radio-popUp-wrapper  ${closing ? "closing" : "opening"}`}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the pop-up
    >
      <div className="radio-popUp">
        <button className="close-btn" onClick={close}>×</button>
        {/* <div className="task-title">{task.title}</div> */}
        {radio.isStreaming ? (
          <>
          <div className='radio-country'>
            {radio.streaming.radio.country}
          </div>
          <div className='radio-name'>
            {radio.streaming.station.name}
          </div>
            <br />
            <button className='btn-sync' onClick={(e) => { syncRadio(radio.streaming.radio,radio.streaming.station) }}>SYNC NOW!!!</button>
          </>
        ) : (
          <p>They're sitting in silence.</p>
        )}
      </div>
    </div>
  );
}  

const MainTab = () => {
  const [activeTab, setActiveTab] = useState("chat"); // Manage active tab state
  const [messages, setMessages] = useState([]); // Shared messages state
  useEffect(() => {
    // Listen for received messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        { type: "received", sender: data.sender, message: data.message },
      ]);
    });
  
    // Clean up listener on component unmount
    return () => socket.off("receiveMessage");
  }, []);
  
  return (
    <div className="chatbox-container">
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬
        </button>
        <button
          className={`tab-btn ${activeTab === "people" ? "active" : ""}`}
          onClick={() => setActiveTab("people")}
        >
          👥
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "chat" && <Chat messages={messages} setMessages={setMessages} />}
        {activeTab === "people" && <People />}
      </div>
    </div>
  );
};

const RadioTopMenu = () => { 
  return(
    <div className='top-detection'>
      <div className='radio-window'>
        <Radio />
      </div>
    </div>
  )
 }

  // MAIN PARENT COMPONENT
const InServerOverlay = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserTask, setSelectedUserTask] = useState(null);
  const [selectedUserRadio, setSelectedUserRadio] = useState(null);

  useEffect(() => {
    const handleSelectUser = (user) => setSelectedUser(user);
    const handleSelectUserTask = (task) => {setSelectedUserTask(task); console.log(task);};
    const handleSelectUserRadio = (radio) => {setSelectedUserRadio(radio); console.log(radio);};
    userEmitter.on("selectUser", handleSelectUser);
    userEmitter.on("selectUserTask", handleSelectUserTask);
    userEmitter.on("selectUserRadio", handleSelectUserRadio);
    return () => {
      userEmitter.off("selectUser", handleSelectUser)
      userEmitter.off("selectUserTask", handleSelectUserTask)
      userEmitter.off("selectUserRadio", handleSelectUserRadio)
    };
  }, []);

  const closePopup = () => {
    setTimeout(() => setSelectedUser(null), 400); // Wait for animation to finish
    // setSelectedUser(null);
  }
  const closePopupTask = () => {
    setTimeout(() => setSelectedUserTask(null), 400); // Wait for animation to finish
    // setSelectedUser(null);
  }
  const closePopupRadio = () => {
    setTimeout(() => setSelectedUserRadio(null), 400); // Wait for animation to finish
    // setSelectedUser(null);
  }

  return (
    <div className="overlay-main">
      <RadioTopMenu />
      <TaskWindow />
      <MainTab />
      <RadioPopUp radio={selectedUserRadio} onClose={closePopupRadio} /> 
      <TaskPopUp task={selectedUserTask} onClose={closePopupTask} /> 
      <ProfilePopUp user={selectedUser} onClose={closePopup} />
    </div>
  );
};
  
export default InServerOverlay;
