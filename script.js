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

const geometry =new THREE.IcosahedronGeometry(1.2,0);
const material =new THREE.MeshBasicMaterial({
    color :0xff5b14,
    wireframe: true,
    transparent: true,
    opacity: 0.8
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
