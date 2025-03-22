import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import roomModel from '../../assets/rooms/scene.glb';
import hdr from '../../assets/background/NightSkyHDRI008_2K-TONEMAPPED.jpg'; // JPG background
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Room = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Set JPG image as background
    scene.background = new THREE.TextureLoader().load(hdr);

    // Load the GLTF room model
    const loader = new GLTFLoader();
    loader.load(
      roomModel,
      function (gltf) {
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error('An error occurred', error);
      }
    );

    // camera.position.z = 3;
    camera.position.set(8, 4, 3);
    camera.rotateZ(95);

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
    //   console.log(camera.position);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Room;
