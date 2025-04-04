useEffect(() => {
    const updatePoseNodes = () => { 
      console.log('Pose node constructions started...');
      // Create new pose nodes as 3D objects
      poses.forEach((pose, index) => { 
        const posePosition = new THREE.Vector3(); 
        pose.getWorldPosition(posePosition); // Get the world position of the pose
        loader.load('/poseNodeObject.glb',(node) => { // Load the node's 3D model
          const poseNode = node.scene.getObjectByName('pose-node'); //select the node not as scene but as OBJ the mesh itself
          poseNode.position.copy(posePosition); // Set the pose node to its position
          poseNode.scale.set(0.1,0.1,0.1) // adjusting scale
          sceneRef.current.add(poseNode);  // Add the pose node to the scene
          // Updating the pose nodes and specifying that they're empty
          setPoseNodes((prev) => {
            const updatedNodes = [...prev, { pose, isOccupied: false }];
            poseNodesRef.current = updatedNodes; // Keep the ref in sync
            return updatedNodes;
          });

          // IN THE CLICK EVENT!! :
          poseNode.onClick = () => {
            console.log('poses:');
            console.log(poses);
            console.log('posesNodes:');
            console.log(poseNodes);

            const poseIndex = index; // the pose's index is the same as the node's index
            // if(myInServerSettings.currentPose){ // if user had a previous pose, we mark it as free (not occupied)
            //   const updatedPoseNode = poseNodes[myInServerSettings.currentPose]; // here we find the exact pose they had
            //   console.log('pose nodes:',poseNodes);
            //   console.log('updated pose nodes:',updatedPoseNode);
            //   updatedPoseNode.isOccupied = false; // update
            //   poseNodes.splice(myInServerSettings.currentPose, 1, updatedPoseNode); //assign the new node and remove the old one
            // }

            dispatch(setCurrentPose(poseIndex)); // we uppdate the current pose before actually posing, this is a redux state

            const updatedPoseNode = poseNodesRef.current; // now we find the new pose node that user clicked and mark it as occupied 
            updatedPoseNode.isOccupied = true;

            poseNodes.splice(poseIndex, 1, updatedPoseNode); 

            socket.emit('poseChanged', roomData.roomData.id, poseIndex);

            poseAvatar(mainAvatarObject, poses[poseIndex]); // transform the mesh

            dispatch(updateFreeNodes(poseNodes.filter((node) => !node.isOccupied))); //this will return the available nodes and save them in the redux state

          }; // END OF CLICK EVENT
        })
      });
    };

    if (poses.length > 0) {
      updatePoseNodes(); // if scene has poses we update pose nodes
    }
  }, [poses]);