const canvas= document.getElementById('webgl-canvas');
const container =document.querySelector('.avatar-container');

const scene =new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z=3;
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true,
    antialias : true
});

renderer.setSize(container.clientWidth , container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

const geometry =new THREE.BoxGeometry(1.8,1.8,1.8);
const texture = new THREE.TextureLoader().load('pics/Screenshot 2026-10-29 205532.png');
const material =new THREE.MeshBasicMaterial({
   
    map : texture,
    transparent: true,
  
});

const wireframobj =new THREE.Mesh(geometry,material);
scene.add(wireframobj);

function animate(){
    requestAnimationFrame(animate);
    wireframobj.rotation.x += 0.005;
    wireframobj.rotation.y += 0.01;

    renderer.render(scene , camera);
}
animate();
