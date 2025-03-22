import React from 'react'
import '../../style/serverInfo.css'

const ServerInfo = ({roomData, callback}) => {
  return (
        <div id='server-info'>
            <div className="room-preview landscape-pic" style={{ backgroundImage: 'url(https://picsum.photos/200)' }}></div>
            <div className='server-info-contents'>
                <h2>{roomData.title}</h2>
                Activity | <div className='server-info-desc'>{roomData.activity}</div>
                <div className='server-info-capacity'>Capacity | {roomData.capacity} / {roomData.users}</div>
            </div>
                <button className='server-info-join' onClick={() => { callback(roomData) }}>Join</button>
        </div>
  )
}

export default ServerInfo
