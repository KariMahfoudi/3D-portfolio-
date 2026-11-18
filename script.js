function initAvatar() {
    const canvas = document.getElementById('webgl-canvas');
    const container = document.querySelector('.avatar-container');
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const texture = new THREE.TextureLoader().load('pics/Screenshot 2026-10-29 205532.png');
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });

    const wireframobj = new THREE.Mesh(geometry, material);
    scene.add(wireframobj);

    function animate() {
        requestAnimationFrame(animate);
        wireframobj.rotation.x += 0.005;
        wireframobj.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

function initMintSnapLogo() {
    const canvas = document.getElementById('project-logo-canvas');
    const container = document.querySelector('.project-logo');
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    function resize() {
        if (!container) return;
        const size = Math.min(container.clientWidth, container.clientHeight, 160) || 150;
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const leafGroup = new THREE.Group();
    scene.add(leafGroup);

    const mintLeafTiles = [
        [[-0.857,0.609],[-0.787,0.852],[-0.778,0.600],[-0.787,0.583],[-0.857,0.591],[-0.848,0.583],[-0.848,0.670],[-0.796,0.843]],
        [[-0.726,0.817],[-0.674,1.000],[-0.622,1.104],[-0.604,1.130],[-0.552,1.078],[-0.535,1.087],[-0.483,1.217],[-0.404,1.330],[-0.404,0.583],[-0.726,0.583],[-0.726,0.809],[-0.709,0.826],[-0.674,1.000],[-0.613,1.122],[-0.517,1.139],[-0.413,1.330]],
        [[-0.352,1.374],[-0.317,1.322],[-0.265,1.426],[-0.091,1.583],[-0.039,1.652],[-0.022,1.652],[-0.022,0.583],[-0.352,0.583],[-0.352,1.365],[-0.283,1.383],[-0.257,1.435],[-0.083,1.591],[-0.030,1.661]],
        [[0.022,1.652],[0.039,1.652],[0.230,1.470],[0.317,1.322],[0.352,1.365],[0.030,1.661],[0.230,1.470],[0.283,1.383],[0.352,1.365],[0.352,0.583],[0.039,0.583],[0.022,0.609],[0.030,1.661]],
        [[0.413,1.330],[0.535,1.096],[0.552,1.078],[0.604,1.130],[0.674,1.000],[0.726,0.817],[0.413,1.330],[0.517,1.139],[0.613,1.122],[0.674,1.000],[0.726,0.809],[0.726,0.583],[0.404,0.583],[0.404,1.330]],
        [[0.787,0.852],[0.839,0.713],[0.857,0.609],[0.796,0.843],[0.848,0.670],[0.848,0.583],[0.787,0.583],[0.778,0.843]],

        [[-1.048,-0.052],[-1.030,-0.052],[-1.013,0.270],[-0.996,0.278],[-0.961,0.252],[-0.943,0.487],[-0.926,0.530],[-0.787,0.530],[-0.778,-0.304],[-0.787,-0.322],[-0.996,-0.313],[-1.048,-0.122],[-0.987,-0.322],[-1.039,-0.183],[-1.048,-0.061],[-0.987,-0.043],[-1.022,0.113],[-1.022,0.217],[-1.004,0.287],[-0.952,0.304],[-0.952,0.443],[-0.926,0.530]],
        [[-0.726,0.530],[-0.404,0.530],[-0.404,-0.322],[-0.726,-0.322],[-0.726,0.530]],
        [[-0.352,0.530],[-0.022,0.530],[-0.022,-0.322],[-0.352,-0.322],[-0.352,0.530]],
        [[0.022,0.513],[0.039,0.530],[0.352,0.522],[0.352,-0.322],[0.039,-0.322],[0.022,-0.304],[0.030,0.530]],
        [[0.413,0.530],[0.726,0.530],[0.726,-0.322],[0.404,-0.322],[0.404,0.530]],
        [[0.787,0.530],[0.926,0.530],[0.943,0.487],[0.961,0.252],[1.013,0.287],[1.030,-0.052],[1.048,-0.052],[0.926,0.530],[0.952,0.443],[0.952,0.304],[1.013,0.287],[1.022,0.235],[1.022,0.130],[0.987,-0.043],[1.048,-0.061],[1.039,-0.183],[0.987,-0.322],[1.048,-0.139],[1.013,-0.270],[0.978,-0.322],[0.787,-0.322],[0.787,0.530]],

        [[-1.030,-0.374],[-0.778,-0.391],[-0.787,-0.948],[-0.926,-0.774],[-0.943,-0.626],[-0.978,-0.574],[-1.030,-0.409],[-0.796,-0.939],[-0.900,-0.817],[-0.935,-0.748],[-0.865,-0.730],[-0.987,-0.557],[-1.030,-0.383]],
        [[-0.726,-0.374],[-0.404,-0.391],[-0.404,-1.226],[-0.500,-1.209],[-0.604,-1.157],[-0.726,-1.061],[-0.422,-1.235],[-0.587,-1.165],[-0.726,-1.061],[-0.726,-1.043],[-0.665,-1.026],[-0.726,-0.974],[-0.726,-0.383]],
        [[-0.352,-0.383],[-0.022,-0.383],[-0.022,-1.270],[-0.039,-1.270],[-0.057,-1.209],[-0.196,-1.252],[-0.352,-1.243],[-0.039,-1.270],[-0.335,-1.252],[-0.352,-1.235],[-0.352,-0.383]],
        [[0.022,-0.391],[0.178,-0.374],[0.352,-0.383],[0.335,-0.374],[0.352,-0.391],[0.352,-1.243],[0.057,-1.261],[0.352,-1.243],[0.196,-1.252],[0.074,-1.217],[0.057,-1.270],[0.022,-1.270],[0.030,-0.383]],
        [[0.413,-0.383],[0.726,-0.383],[0.639,-0.374],[0.726,-0.391],[0.726,-0.983],[0.674,-1.017],[0.726,-1.052],[0.726,-1.070],[0.604,-1.157],[0.448,-1.226],[0.726,-1.070],[0.604,-1.157],[0.430,-1.235],[0.404,-1.235],[0.404,-0.383]],
        [[0.787,-0.383],[1.030,-0.374],[0.987,-0.548],[0.943,-0.635],[0.857,-0.739],[0.935,-0.757],[0.804,-0.930],[1.030,-0.417],[0.943,-0.635],[0.926,-0.774],[0.839,-0.896],[0.787,-0.939],[0.778,-0.383]],

        [[-0.257,-1.252],[-0.187,-1.252],[-0.135,-1.565],[-0.100,-1.496],[-0.030,-1.252],[0.057,-1.252],[0.039,-1.391],[-0.039,-1.652],[0.057,-1.296],[0.022,-1.470],[-0.048,-1.652],[-0.135,-1.600],[-0.187,-1.252],[-0.257,-1.252],[-0.065,-1.643],[-0.143,-1.591],[-0.091,-1.487],[-0.039,-1.261]]
    ];

    const extrudeSettings = {
        depth: 0.14,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.015,
        bevelSegments: 2
    };

    mintLeafTiles.forEach((rawPts) => {
        const pts = [];
        for (let i = 0; i < rawPts.length; i++) {
            const curr = rawPts[i];
            const prev = pts[pts.length - 1];
            if (!prev || Math.hypot(curr[0] - prev[0], curr[1] - prev[1]) > 0.015) {
                pts.push(curr);
            }
        }
        if (pts.length < 3) return;

        const shape = new THREE.Shape();
        shape.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
            shape.lineTo(pts[i][0], pts[i][1]);
        }
        shape.closePath();

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const curve = -0.18 * (x * x) - 0.04 * (y * 0.4);
            pos.setZ(i, z + curve);
        }
        geometry.computeVertexNormals();

        const darkMat = new THREE.MeshBasicMaterial({
            color: 0x141414,
            transparent: true,
            opacity: 0.85,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });
        const darkMesh = new THREE.Mesh(geometry, darkMat);
        leafGroup.add(darkMesh);

        const wireframeMat = new THREE.MeshBasicMaterial({
            color: 0xff5b14,
            wireframe: true,
            transparent: true,
            opacity: 0.45
        });
        const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
        leafGroup.add(wireframeMesh);

        const edges = new THREE.EdgesGeometry(geometry, 20);
        const edgeLines = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xff5b14, linewidth: 2 })
        );
        leafGroup.add(edgeLines);
    });

    leafGroup.position.set(0, -0.05, 0);

    let targetRotX = 0;
    let targetRotY = 0;
    let isHovered = false;

    const projectCard = document.querySelector('.project-card');
    if (projectCard) {
        projectCard.addEventListener('mouseenter', () => { isHovered = true; });
        projectCard.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRotX = 0;
            targetRotY = 0;
        });
        projectCard.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            targetRotY = relX * 0.7;
            targetRotX = -relY * 0.5;
        });
    }

    const clock = new THREE.Clock();
    function animateLogo() {
        requestAnimationFrame(animateLogo);
        const elapsedTime = clock.getElapsedTime();

        const speed = isHovered ? 0.025 : 0.012;
        leafGroup.rotation.y += speed;

        leafGroup.position.y = -0.05 + Math.sin(elapsedTime * 2) * 0.06;

        if (isHovered) {
            leafGroup.rotation.x += (targetRotX - leafGroup.rotation.x) * 0.08;
            leafGroup.rotation.z += (-targetRotY * 0.3 - leafGroup.rotation.z) * 0.08;
        } else {
            const idleRotX = Math.sin(elapsedTime * 1.2) * 0.12;
            const idleRotZ = Math.cos(elapsedTime * 0.9) * 0.06;
            leafGroup.rotation.x += (idleRotX - leafGroup.rotation.x) * 0.05;
            leafGroup.rotation.z += (idleRotZ - leafGroup.rotation.z) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animateLogo();
}

window.addEventListener('DOMContentLoaded', () => {
    initAvatar();
    initMintSnapLogo();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAvatar();
    initMintSnapLogo();
}
