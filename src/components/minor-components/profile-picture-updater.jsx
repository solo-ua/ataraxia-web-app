import React, { useRef, useState } from 'react'
import Resizer from 'react-image-file-resizer'; 
import AlertMessage from './top-popup-alert';

const ProfilePicture = ({classname,src}) => {
  const [pfp,setPfp] = useState(src? src : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png');
  const [alert, setAlert] = useState({alert:false,message:'',type:'success'});
  const fileInputRef = useRef(null);

  const handleClick = () => { 
    fileInputRef.current.click();
  }
  const handleFileChange = (e) => { 
    try{
      const file = e.target.files?.[0];
      if(file){
        adjustImage(file);
      }else{
        setAlert({alert:true,message:'No image file was selected.',type:'error'});
      }
    }catch(e){
      setAlert({alert:true,message:'No image file was selected.',type:'error'});
    }
  }
  const adjustImage = (image) => { 
    Resizer.imageFileResizer(image, 500, 500, 'JPEG', 100, 0, (uri) => { 
      setPfp(uri);
      setAlert({alert:true,message:'Upload successful!',type:'success'});
    },'base64');
  }
  return (
    <div className={classname} style={{ border: 'none', display: "flex"}}>  
        {alert.alert && (<AlertMessage message={alert.message} onClose={() => setAlert({ alert: false, message: '', type: '' })}  type={alert.type}/>)}
        <img src={pfp} className={classname} onClick={handleClick}/>
        <input
        type="file"
        className="invisible"
        style={{ position: "absolute", zIndex: 5 }}
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      

    </div>
  )
}

export default ProfilePicture
