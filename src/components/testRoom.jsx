import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPose } from "../redux/actions/inServer-actions";
import { updateFreeNodes, updateUsers } from "../redux/actions/server-actions";
import socket from '../socket.js'


const Room = (roomData, me) => {
  const [loading, setLoading] = useState(true);
  const [mainAvatarObject, setMainAvatar] = useState(null);  //used for direct avatar accessing 
  const myInServerSettings = useSelector((state) => state.inServer);
  const myAccount = useSelector((state) => state.user);
  let roomRef = useRef(); // used for direct room accessing
  const sceneRef = useRef(); 
  const cameraRef = useRef(); 
  const cameraControlsRef = useRef(); 
  const poseRef = useRef([]); // for pose node onmouseclick creation
  const otherUsersAvatarRef = useRef([]); // for other's avatar ref
  
  const dispatch = useDispatch();

  const loader = new GLTFLoader();
  
  const [poses, setPoses] = useState([]);
  const [poseNodes,setPoseNodes] = useState([]); // to store information about poses (such as occupied or not)

  // Posing avatar and the helper functions
  function poseAvatar(avatar, pose) {
    function getIndex(inputString) {
      const match = inputString.match(/\d+$/); // Match one or more digits at the end of the string
      return match ? match[0] : null; // Return the matched numbers or null if no match
    }

    // Get the root of every armeture
    const avatarRootBone = avatar.getObjectByName('root'); //main root of the avatar
    const poseRootBone = pose.children.find(obj => obj.name.startsWith('root')); //root of the poses which may be indexed
    const poseIndex = getIndex(poseRootBone.name); // getting the index of the pose to match the bones
    if (!avatarRootBone || !poseRootBone) {
        console.error("Root bones not found in one or both rigs.");
        return;
    }
    copyRigGlobalPosition(avatar, pose);    
    copyBoneTransformsByName(avatarRootBone, poseRootBone, poseIndex);
  }
  // Helper function
  function copyBoneTransformsByName(avatarBone, poseBone, index) {
    // console.log(`Copying bone transforms for: ${avatarBone.name}`);

    // Copy position, quaternion (rotation), and scale
    avatarBone.position.copy(poseBone.position);
    avatarBone.quaternion.copy(poseBone.quaternion);
    avatarBone.scale.copy(poseBone.scale);
    avatarBone.updateMatrixWorld(true);

    // Loop through avatar's child bones
    avatarBone.children.forEach((avatarChild) => {
        let poseChild = null;

        // Try matching by name with variations
        const possibleNames = [
            avatarChild.name, // Direct match
            `${avatarChild.name}_${index}`, // Indexed match
            `${avatarChild.name}${index}`, // Alternative indexed match
        ];

        // Find the first valid match
        for (const name of possibleNames) {
            poseChild = poseBone.getObjectByName(name);
            if (poseChild) break; // Stop checking once a match is found
        }

        if (poseChild) {
            // console.log(`Copying transform for child: ${poseChild.name}`);
            copyBoneTransformsByName(avatarChild, poseChild); // Recursively copy transforms
        } else {
            // console.log(`No matching child found for: ${avatarChild.name}`);
        }
    });
}

  function copyRigGlobalPosition(avatar, pose) {
    // Transfer global position
    avatar.position.copy(pose.position);

    // Transfer global rotation using quaternions for robustness
    avatar.quaternion.copy(pose.quaternion);

    // Transfer global scale (uncomment if needed)
    avatar.scale.copy(pose.scale);
}

// loading main avatar
const loadAvatarMain = () => {
  loader.load(
    '/seriousTestAvatar.glb',
    (avatar) => { 
      sceneRef.current.add(avatar.scene);
      sceneRef.current.mainAvatar = avatar.scene; // save the ref to the avatar
      // TODO fix the hierarchy
      // setMainAvatar(avatar.scene.children[0]);
      setMainAvatar(avatar.scene);
      addRef(socket.id , avatar.scene)
      // get the cneter of the model for the cameraControls
      const box = new THREE.Box3().setFromObject(avatar.scene);
      const modelCenter = box.getCenter(new THREE.Vector3()); // get the center of the model and convert the center to a vector 
      cameraRef.current.position.set(modelCenter.x, modelCenter.y, modelCenter.z+5); // center the camera and tilt it up slightly
      cameraControlsRef.current.target.copy(modelCenter); // set the orbit camera center the same as the model's
      // zooming limits from the center of the user
      cameraControlsRef.current.minDistance = 1; 
      cameraControlsRef.current.maxDistance = 4;
      // camera vertical orbit limits (can still do 360) 
      cameraControlsRef.current.minPolarAngle = Math.PI / 3;  // minimal vertical angle(from the ground)
      cameraControlsRef.current.maxPolarAngle = Math.PI / 2; // max vertical angle (almost straight down)
      cameraControlsRef.current.update(); // update them
    }
  )
}

const addRef = (id, avatar) => { 
 // Store a reference to the loaded avatar and associate it with the user ID
  otherUsersAvatarRef.current.push({
    id: id,         //id of the socket
    avatar: avatar, // Store the 3D scene reference
  });
  console.log(otherUsersAvatarRef.current);
 }
// loading other's avatar and positions
const loadAvatars = (user) => {
    const { socketUid, currentPose } = user; 
    loader.load(
      '/seriousTestAvatar.glb',
      (avatar) => {
        console.log(avatar);
        sceneRef.current.add(avatar.scene);       
        addRef(socketUid,avatar);
        // Optionally set the initial pose
        if (currentPose) {
          poseAvatar(avatar.scene, currentPose); // Define this function to apply poses
        }
      }
    );
};

// const loadAvatars = (allAvatars) => {
//   const userAvatars = allAvatars.filter(user => user.socketUid !== socket.id);
//   // Iterate over the array of users to load avatars for each one
//   userAvatars.forEach((user) => {
//     const { socketUid, currentPose } = user; 
//     loader.load(
//       '/seriousTestAvatar.glb',
//       (avatar) => {
//         // Add the loaded avatar to the scene
//         // avatar.scene.name = `avatar-${socketUid}`; // Name the scene for identification
//         sceneRef.current.add(avatar.scene);
       
//         addRef(socketUid,avatar);
       
//         console.log('Updated otherUsersAvatarRef:', otherUsersAvatarRef.current);
//         // Optionally set the initial pose
//         if (currentPose) {
//           poseAvatar(avatar.scene, currentPose); // Define this function to apply poses
//         }
//         console.log(`Avatar for user with socket id ${socketUid} loaded and added to the scene.`);
//       }
//     );
//   });
// };

// load room
const loadRoom = (roomUrl) => {
  loader.load( 
    "/forPresentation.glb",
    (room) => {
      sceneRef.current.add(room.scene); // add the room to the scene
      roomRef = room.scene; // SAVE THE REF
      const posesTemp = [];
      for(let i = 0; i < 10 ; i++){
        if (room.scene.getObjectByName(`pose-node-${i}`)) { // here it should be pose-index put this in a loop
          posesTemp.push(room.scene.getObjectByName(`pose-node-${i}`));
        }
      }
      poseRef.current = posesTemp;
      setPoses(posesTemp);
      // TODO consider including these settings in the database for dynamic light
      const ambientLight = new THREE.AmbientLight(0x404040, 25);
      sceneRef.current.add(ambientLight); // Add light to the scene
      // create a general function to check if the rest are loaded then set loading to false
    }
  );

}
// useEffect(() => { console.warn('main avatar was re-assigned'); },[mainAvatarObject])

  useEffect(() => {
    console.log(roomData);
    // settings up the scene:
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
    const raycaster = new THREE.Raycaster();
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // the rednerer
    renderer.setSize(window.innerWidth, window.innerHeight); // the size that renderer should be
    
    // creating orbit camera
    const cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.enableDamping = true; // since we are moving the camera, we need damping to loop animation
    cameraControls.dampingFactor = 1; //smooth camera movement and rotation
    cameraControls.screenSpacePanning = false; // more natural camera navigation
    cameraControls.enablePan = true; // camera panning
    
    sceneRef.current = scene;
    cameraRef.current = camera;
    cameraControlsRef.current = cameraControls;
    roomRef.current.appendChild(renderer.domElement); // render the scene
    
    // RAYCASTING CLICK EVENT SET UP
    const mouse = new THREE.Vector2(); // for raycasting to detect any mouse clicks or movement   
    const handleMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
      raycaster.setFromCamera(mouse, cameraRef.current);
  
      // check for intersections with the pose nodes
      const intersects = raycaster.intersectObjects(scene.children, true); // true for checking children too
  
      if (intersects.length > 0) {
        // Check if the clicked object is one of the pose nodes
        const clickedObject = intersects[0].object;
        if (clickedObject && clickedObject.onClick) {
          clickedObject.onClick();
        }
      }
    };    
    window.addEventListener('click', handleMouseClick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    socket.on('userJoined', ( newUserData ) => {
      console.log('checking if user joined...');
      // console.log(`New user joined room ${roomId}:`, newUserData);
      alert(`${newUserData.nickname} has arrived!`);
      loadAvatars(newUserData);
      dispatch(updateUsers(newUserData)); //update the global state

    });
    socket.on('updatePose', (updatedUser) => {
      // Find the avatar reference corresponding to the updated user
      if(updatedUser.socketUid != socket.id){
        const avatarRef = otherUsersAvatarRef.current.find(ref => ref.id === updatedUser.socketUid); //find the avatar's reference to update it
        const avi = avatarRef.avatar.scene.children[0]; // access the avatar
        const pose = poseRef.current[updatedUser.currentPoseIndex]; // the pose user changed to
        // issue with poses or poseNode array
        //REMARK saving the pose obj as it is, causes issues where the pose is converted to json when being exchanged         
        // That is why we save it as index
        poseAvatar(avi , pose)
      }
    });
    
    loadRoom();
    loadAvatarMain(); // use a selector here for custom avatar
    roomData.roomData.userData.forEach((user) => {
      if(user.socketUid != socket.id)
      loadAvatars(user);
    })
    
    
    const animate = () => {
      requestAnimationFrame(animate);
      cameraControls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    setLoading(false);
    // cleanup on unmount
    return () => {
      window.removeEventListener('click', handleMouseClick);
      renderer.dispose();
      roomRef.current.removeChild(renderer.domElement);
      socket.off('joinRoom');
    };
  }, []);

  // Managing poses: Server.freeNodes state and the userData.currentPose state (And posing basically)
  /*
    To ensure the user's current pose is saved and marked as an occupied node
    we use the free nodes then to show which poses are not occupied for other users, theyre saved as index
  */ 
    useEffect(() => {
      const updatePoseNodes = () => { 
        console.log('Pose node constructions started...');
        // Clear existing pose nodes first to prevent duplicates
        setPoseNodes([]);
        
        // Create new pose nodes as 3D objects
        poses.forEach((pose, index) => { 
          const posePosition = new THREE.Vector3(); //create new position vector
          pose.getWorldPosition(posePosition); // get the pose's world position to copy it for the node
           
          loader.load('/poseNodeObject.glb', (node) => { // load the node's 3d model
            const poseNode = node.scene.getObjectByName('pose-node'); // select the node itself as mesh and not as scene from the .glb
            poseNode.position.copy(posePosition); // position the node to the pose's armeture which is invisible.
            poseNode.scale.set(0.1, 0.1, 0.1); // adjust scale
            sceneRef.current.add(poseNode); // add the node OBJ to the general scene 
            
            // Add to pose nodes array the index of pose and if it is occupied
            setPoseNodes(prev => {
              return [...prev, { index, isOccupied: false }];
            });
            
            // Setup click handler
            poseNode.onClick = () => {
              console.log('Node clicked at index:', index);
              
              const poseIndex = index; // the pose's index is the same as the node's index
              
              // Update state with the latest values using functional update
              setPoseNodes(currentPoseNodes => {
                const updatedPoseNodes = [...currentPoseNodes];
                
                // If the user had a previous pose, mark it as free
                if (myInServerSettings.currentPose) {
                  updatedPoseNodes[myInServerSettings.currentPose].isOccupied = false;
                }
                
                // Mark the clicked pose as occupied
                updatedPoseNodes[poseIndex].isOccupied = true;
                
                // Return the updated state
                return updatedPoseNodes;
              });
              
              dispatch(setCurrentPose(poseIndex));
              socket.emit('poseChanged', roomData.roomData.id, poseIndex);
              poseAvatar(mainAvatarObject, poses[poseIndex]);
              
              // Update free nodes with the latest state
              setPoseNodes(latestPoseNodes => {
                dispatch(updateFreeNodes(latestPoseNodes.filter((node) => !node.isOccupied)));
                return latestPoseNodes; // Return unchanged to avoid extra render
              });
            };
          });
        });
      };
    
      if (poses.length > 0) {
        console.log('Poses detected, length:', poses.length);
        updatePoseNodes();
      }
    }, [poses]);

  return (
    <div style={{position: 'absolute'}}>
      {loading && <div>Loading...</div>}
      <div ref={roomRef}></div>
    </div>
  );
};

export default Room;
