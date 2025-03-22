import React, { useRef, useState } from 'react'
import '../../style/createServer.css'
import CustomDropdown from './customDropdown'


const CreateServer = ({callback}) => {
    const [privacyOption, setPrivacyOption] = useState("public");
    const [roomOption, setRoomption] = useState("");
    const privacyOptions = [
        { value: "public", label: "Public" },
        { value: "friends-only", label: "Friends Only" },
        { value: "private", label: "Private" },
      ];
    const roomOptions = [
        { value: "public", label: "Public" },
        { value: "friends-only", label: "Friends Only" },
        { value: "private", label: "Private" },
      ];
    const titleRef = useRef();
    const descRef = useRef();
    const capacityRef = useRef();

    const handleCreateServer = () => { 
        const roomData = {
          title: titleRef.current.value,
          activity: descRef.current.value,
          capacity: capacityRef.current.value,
          privacy: privacyOption,
        };
        callback(roomData);
     }


  return (
    <div id='create-server'>
        <h1>Create a Server</h1>
        <div className='create-window'>
            <div className="room-preview portrait-pic" style={{ backgroundImage: 'url(https://picsum.photos/200)' }}></div>
            <div className='create-server-contents'>
                <input ref={titleRef} type="text" maxLength={25} className='create-server-in textfield' placeholder='Title' />
                <textarea ref={descRef} className='create-server-in textfield descript1' placeholder='Description or activity...' />
                {/* AUTOFILL THESE */}
                <div> 
                   <div className='create-server dropdowns'>
                        Accessibility | <CustomDropdown options={privacyOptions} selected={privacyOption} onChange={setPrivacyOption} />
                        Type | <CustomDropdown options={roomOptions} selected={roomOption} onChange={setRoomption} />
                        <div className='capacity-helper'>
                            Capacity | 
                            {/* TODO CHANGE THE MAXIMUM */}
                            <input ref={capacityRef} type="number" className='create-server-in textfield capacity' max={50} min={2}/>
                        </div>
                    </div>
                </div>            

            </div>
                <button className='create-server-button' onClick={handleCreateServer}>Create</button>
        </div>
        <div className='create-server-note'>
            Note | Any created rooms with no visitors will be automatically deleted.
        </div>
    </div>
  )
}

export default CreateServer
