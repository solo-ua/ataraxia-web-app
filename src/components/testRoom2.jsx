import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';


// Box blur shader
const  boxBlurShader = {
    uniforms: {
      tDiffuse: { value: null },
      h: { value: 1.0 / window.innerHeight },
      w: { value: 1.0 / window.innerWidth },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform float h;
      uniform float w;
      void main() {
        vec4 sum = vec4(0.0);
        sum += texture2D(tDiffuse, vec2(vUv.x - w, vUv.y - h)) * 0.1; // Left-Top
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - h)) * 0.05; // Top
        sum += texture2D(tDiffuse, vec2(vUv.x + w, vUv.y - h)) * 0.1; // Right-Top
        sum += texture2D(tDiffuse, vec2(vUv.x - w, vUv.y)) * 0.05; // Left
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y)) * 1.1; // Center pixel
        sum += texture2D(tDiffuse, vec2(vUv.x + w, vUv.y)) * 0.05; // Right
        sum += texture2D(tDiffuse, vec2(vUv.x - w, vUv.y + h)) * 0.1; // Left-Bottom
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + h)) * 0.05; // Bottom
        sum += texture2D(tDiffuse, vec2(vUv.x + w, vUv.y + h)) * 0.1; // Right-Bottom
        gl_FragColor = sum;
      }
    `,
  };


// Denoiser shader
const denoiseShader = {
    uniforms: {
      tDiffuse: { value: null },
      invTexSize: { value: new THREE.Vector2(1.0 / window.innerWidth, 1.0 / window.innerHeight) },
      blur: { value: 20 },  // Adjust this for blur strength
      blurSharpness: { value: 50 }, // Adjust this for how sharp the blur is
      blurKernel: { value: 1.5 }, // Kernel size for blur
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform vec2 invTexSize;
      uniform float blur;
      uniform float blurSharpness;
      uniform int blurKernel;
  
      void main() {
        vec3 center = texture2D(tDiffuse, vUv).rgb;
  
        vec3 color = vec3(0.0);
        float total = 0.0;
        vec3 col;
        float weight;
  
        for (int x = -blurKernel; x <= blurKernel; x++) {
          for (int y = -blurKernel; y <= blurKernel; y++) {
            col = texture2D(tDiffuse, vUv + vec2(x, y) * invTexSize).rgb;
            weight = 1.0 - abs(dot(col - center, vec3(0.25)));
            weight = pow(weight, blurSharpness);
            // Ensure weight is non-negative to avoid black spotting
            weight = max(weight, 1.0);
            
            color += col * weight;
            total += weight;
          }
        }
  
        // Avoid division by zero
        if (total > 0.0) {
          color /= total;
        }
  
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  };
  

const Room = () => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering quality

    mountRef.current.appendChild(renderer.domElement);

    scene.fog = new THREE.Fog(0x000000, 1, 20); // Or use FogExp2 for exponential fog


    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // An animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25; // An optional damping factor
    controls.screenSpacePanning = false; // Prevents panning in screen space

    // Load the GLB file using GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      "/testClassroom.glb", // Adjust the path to your GLB file
      (gltf) => {
        scene.add(gltf.scene); // Add the loaded model to the scene
        //cahnge
        // Optionally set the camera position based on the loaded model
        const box = new THREE.Box3().setFromObject(gltf.scene); // Get the bounding box of the loaded model
        const center = box.getCenter(new THREE.Vector3()); // Get the center of the model
        const light = new THREE.AmbientLight( 0x404040 , 25 ); // soft white light
        scene.add( light );
        camera.position.set(0, 0, 0); // Position the camera above and back from the model
        controls.target.copy(center); // Set the controls target to the center of the model
        controls.update(); // Update the controls
        setLoading(false); // Hide loading indicator when done
      },
      undefined,
      (error) => {
        console.error("An error occurred loading the model:", error);
        setLoading(false); // Hide loading indicator on error
      }
    );
     // Load avatar model
     loader.load('/model.glb', (gltf) => {
      const avatarModel = gltf.scene;
      avatarModel.scale.set(1, 1, 1);
      avatarModel.position.set(0, 0, 0);
      etAvatar(avatarModel);s
    });

    // TODO remove debugger
    controls.addEventListener('change', () => {
      console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
    });
    // x=-2.750583052989879, y=1.2507053552244056, z=-5.886286334192813

    // Set up post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // create tthe SSAO
    const ssaoPass = new SSAOPass(scene, camera);
    ssaoPass.radius = 10; // Adjust as necessary
    ssaoPass.aoClamp = 0.5; // Controls brightness of the AO
    ssaoPass.output = SSAOPass.OUTPUT.Default; // Use default output
    composer.addPass(ssaoPass);

    // reflections



    // Film pass for grain
    const filmPass = new FilmPass(0.35, 0.025, 648, false);
    composer.addPass(filmPass);
    
    // Box blur pass
    const boxBlurPass = new ShaderPass(boxBlurShader);
    composer.addPass(boxBlurPass);
    
    // Bloom pass
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.2, 0.4, 0.85);
    composer.addPass(bloomPass);
    
    // Denoise pass
    const denoisePass = new ShaderPass(denoiseShader);
    composer.addPass(denoisePass);
    // TODO change
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('/NightSkyHDRI008_2K-TONEMAPPED.jpg');
    scene.background = bgTexture;
        
    const geometry = new THREE.SphereGeometry(5000, 60, 40);
    const material = new THREE.MeshBasicMaterial({
      map: bgTexture,
      side: THREE.BackSide // Ensures the texture is visible from the inside
    });
    const skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls for damping
      composer.render(); // Use composer to render instead of renderer
    };
    animate();

    // Clean up on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      controls.dispose(); // Clean up controls
      composer.dispose(); // Clean up composer
      renderer.dispose(); // Clean up the renderer
    };
  }, []);

  return (
    <div>
      {loading && <div className="loading">Loading...</div>}
      <div ref={mountRef}></div>
    </div>
  );
};

export default Room;
