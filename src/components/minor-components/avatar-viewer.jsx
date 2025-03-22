import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const AvatarViewer = ({ avatarUrl }) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    // Set up the scene
    const scene = new THREE.Scene();

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    // camera.position.set(0, 1, 2.5); // Lower and zoom in the camera
    camera.position.set(0, 1, 3); // Move the camera up and back
    camera.lookAt(0, 0.5, 0); // Focus slightly above the origin (adjust focal point)

    // Tilt the camera
    camera.rotation.x -= 0.1; // Slight tilt downward (optional)
    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load the avatar
    const loader = new GLTFLoader();
    let avatar;
    loader.load(
      avatarUrl,
      (gltf) => {
        avatar = gltf.scene;
        avatar.scale.set(1.5, 1.5, 1.5); 
        avatar.position.y = -0.9; // lower the avatar
        scene.add(avatar);
      },
      undefined,
      (error) => {
        console.error('Error loading avatar:', error);
      }
    );

    // Render loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      // Spin the avatar
      if (avatar) {
        const elapsedTime = clock.getElapsedTime();
        avatar.rotation.y = elapsedTime * 0.5; // Adjust speed of rotation
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resizing
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Clean up resources
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      if (avatar) avatar.geometry?.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [avatarUrl]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default AvatarViewer;
