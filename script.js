function initAvatar() {
    const canvas = document.getElementById('webgl-canvas');
    const container = document.querySelector('.avatar-container');
    if (!canvas || !container) return;
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(-3, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff5b14, 1.1);
    rimLight.position.set(5, 2, -2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xff8547, 0.5, 12);
    fillLight.position.set(0, -1, 4);
    scene.add(fillLight);

    function createRoundedRectShape(w, h, r) {
        const s = new THREE.Shape();
        const x = -w / 2;
        const y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r);
        s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h);
        s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r);
        s.quadraticCurveTo(x, y, x + r, y);
        return s;
    }

    const headGroup = new THREE.Group();
    scene.add(headGroup);

    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x1e1e21,
        roughness: 0.35,
        metalness: 0.5
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
        color: 0x141416,
        roughness: 0.4,
        metalness: 0.7
    });
    const orangeMat = new THREE.MeshStandardMaterial({
        color: 0xff5b14,
        emissive: 0xff5b14,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.3
    });
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x070709,
        roughness: 0.12,
        metalness: 0.25
    });

    const shellShape = createRoundedRectShape(2.45, 1.72, 0.42);
    const shellGeo = new THREE.ExtrudeGeometry(shellShape, {
        depth: 0.78,
        bevelEnabled: true,
        bevelThickness: 0.16,
        bevelSize: 0.15,
        bevelSegments: 8,
        curveSegments: 16
    });
    shellGeo.center();
    const shellMesh = new THREE.Mesh(shellGeo, bodyMat);
    headGroup.add(shellMesh);

    const bezelShape = createRoundedRectShape(2.26, 1.54, 0.34);
    const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.02,
        bevelSegments: 3,
        curveSegments: 14
    });
    bezelGeo.center();
    const bezelMesh = new THREE.Mesh(bezelGeo, darkMetalMat);
    bezelMesh.position.set(0, 0, 0.52);
    headGroup.add(bezelMesh);

    const trimShape = createRoundedRectShape(2.14, 1.44, 0.3);
    const trimPoints = trimShape.getPoints(56).map(p => new THREE.Vector3(p.x, p.y, 0.581));
    const trimGeo = new THREE.BufferGeometry().setFromPoints(trimPoints);
    const trimLine = new THREE.LineLoop(trimGeo, new THREE.LineBasicMaterial({ color: 0xff5b14 }));
    headGroup.add(trimLine);

    const screenShape = createRoundedRectShape(2.08, 1.38, 0.28);
    const screenGeo = new THREE.ShapeGeometry(screenShape, 16);
    screenGeo.computeBoundingBox();
    const sMax = screenGeo.boundingBox.max;
    const sMin = screenGeo.boundingBox.min;
    const sSize = new THREE.Vector2(sMax.x - sMin.x, sMax.y - sMin.y);
    const uvAttr = screenGeo.attributes.uv;
    const posAttr = screenGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
        uvAttr.setXY(
            i,
            (posAttr.getX(i) - sMin.x) / sSize.x,
            (posAttr.getY(i) - sMin.y) / sSize.y
        );
    }
    uvAttr.needsUpdate = true;

    const textureLoader = new THREE.TextureLoader();
    const faceClosedSrc = window.FACE_CLOSED_DATA_URL || 'pics/face-closed.jpg';
    const faceOpenSrc = window.FACE_OPEN_DATA_URL || 'pics/face-open.jpg';
    const faceClosedTexture = textureLoader.load(faceClosedSrc);
    const faceOpenTexture = textureLoader.load(faceOpenSrc);
    const faceScreenMat = new THREE.MeshBasicMaterial({
        map: faceClosedTexture
    });
    const faceScreenMesh = new THREE.Mesh(screenGeo, faceScreenMat);
    faceScreenMesh.position.set(0, 0, 0.579);
    headGroup.add(faceScreenMesh);

    const antBaseGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.08, 16);
    const antBase = new THREE.Mesh(antBaseGeo, darkMetalMat);
    antBase.position.set(0, 1.04, -0.05);
    headGroup.add(antBase);

    const antRodGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.3, 12);
    const antRod = new THREE.Mesh(antRodGeo, darkMetalMat);
    antRod.position.set(0, 1.21, -0.05);
    headGroup.add(antRod);

    const antTipGeo = new THREE.SphereGeometry(0.045, 14, 14);
    const antTip = new THREE.Mesh(antTipGeo, orangeMat);
    antTip.position.set(0, 1.37, -0.05);
    headGroup.add(antTip);

    const socketGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.18, 20);
    socketGeo.rotateZ(Math.PI / 2);
    const socketMesh = new THREE.Mesh(socketGeo, darkMetalMat);
    socketMesh.position.set(1.38, 0, -0.08);
    headGroup.add(socketMesh);

    const socketRingGeo = new THREE.TorusGeometry(0.165, 0.025, 12, 24);
    socketRingGeo.rotateY(Math.PI / 2);
    const socketRing = new THREE.Mesh(socketRingGeo, orangeMat);
    socketRing.position.set(1.43, 0, -0.08);
    headGroup.add(socketRing);

    const socketAnchor = new THREE.Object3D();
    socketAnchor.position.set(1.47, 0, -0.08);
    headGroup.add(socketAnchor);

    const armGroup = new THREE.Group();
    scene.add(armGroup);

    const midJointGroup = new THREE.Group();
    armGroup.add(midJointGroup);

    const hingeDrumGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.22, 24);
    hingeDrumGeo.rotateX(Math.PI / 2);
    const hingeDrum = new THREE.Mesh(hingeDrumGeo, darkMetalMat);
    midJointGroup.add(hingeDrum);

    const hingeRingGeo = new THREE.TorusGeometry(0.192, 0.022, 12, 24);
    const hingeRing = new THREE.Mesh(hingeRingGeo, orangeMat);
    hingeRing.position.z = 0.08;
    midJointGroup.add(hingeRing);

    const hingeKnobGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.08, 16);
    hingeKnobGeo.rotateX(Math.PI / 2);
    const hingeKnob = new THREE.Mesh(hingeKnobGeo, orangeMat);
    hingeKnob.position.z = 0.13;
    midJointGroup.add(hingeKnob);

    const wristBall = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 18), darkMetalMat);
    armGroup.add(wristBall);

    function createBoomSegment() {
        const segGroup = new THREE.Group();
        const rodGeo = new THREE.CylinderGeometry(0.042, 0.042, 1, 14);
        rodGeo.rotateX(Math.PI / 2);

        const topRod = new THREE.Mesh(rodGeo, bodyMat);
        topRod.position.y = 0.075;
        segGroup.add(topRod);

        const botRod = new THREE.Mesh(rodGeo, bodyMat);
        botRod.position.y = -0.075;
        segGroup.add(botRod);

        armGroup.add(segGroup);

        const clampGeo = new THREE.BoxGeometry(0.13, 0.24, 0.09);
        const clamp1 = new THREE.Mesh(clampGeo, orangeMat);
        const clamp2 = new THREE.Mesh(clampGeo, darkMetalMat);
        armGroup.add(clamp1);
        armGroup.add(clamp2);

        return { segGroup, topRod, botRod, clamp1, clamp2 };
    }

    const innerBoom = createBoomSegment();
    const outerBoom = createBoomSegment();

    let headX = 0;
    let rightEdgeX = 5;

    function resize() {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);

        const rect = container.getBoundingClientRect();
        const pageCenterX = window.innerWidth / 2;
        const ndcX = ((pageCenterX - rect.left) / rect.width) * 2 - 1;
        const halfH = camera.position.z * Math.tan((camera.fov * Math.PI / 180) / 2);
        const halfW = halfH * camera.aspect;

        headX = ndcX * halfW;
        rightEdgeX = halfW;

        const scale = window.innerWidth <= 768 ? 0.92 : 1.18;
        headGroup.scale.set(scale, scale, scale);
    }
    resize();
    window.addEventListener('resize', resize);

    let targetRotX = 0;
    let targetRotY = 0;
    let isHovered = false;
    let isScreenHovered = false;
    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2();

    function setScreenMouth(open) {
        if (isScreenHovered === open) return;
        isScreenHovered = open;
        faceScreenMat.map = open ? faceOpenTexture : faceClosedTexture;
        faceScreenMat.needsUpdate = true;
    }

    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        setScreenMouth(false);
    });
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const pageCenterX = window.innerWidth / 2;
        const centerY = rect.top + rect.height / 2;
        const relX = (e.clientX - pageCenterX) / (rect.width / 2);
        const relY = (e.clientY - centerY) / (rect.height / 2);
        targetRotY = Math.max(-0.45, Math.min(0.45, relX * 0.45));
        targetRotX = Math.max(-0.25, Math.min(0.25, relY * 0.25));

        mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseNdc, camera);
        const hits = raycaster.intersectObject(headGroup, true);
        setScreenMouth(hits.length > 0);
    });

    const clock = new THREE.Clock();
    const socketWorldPos = new THREE.Vector3();
    const midJointPos = new THREE.Vector3();
    const mountPos = new THREE.Vector3();

    function positionSegment(seg, pA, pB) {
        const dist = pA.distanceTo(pB);
        seg.segGroup.position.copy(pA).lerp(pB, 0.5);
        seg.segGroup.lookAt(pB);
        seg.topRod.scale.set(1, 1, dist);
        seg.botRod.scale.set(1, 1, dist);

        seg.clamp1.position.copy(pA).lerp(pB, 0.28);
        seg.clamp1.lookAt(pB);
        seg.clamp2.position.copy(pA).lerp(pB, 0.72);
        seg.clamp2.lookAt(pB);
    }

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        const bobY = Math.sin(elapsedTime * 1.8) * 0.045;
        headGroup.position.set(headX, -0.05 + bobY, 0);

        if (isHovered) {
            headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.08;
            headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.08;
        } else {
            const idleY = Math.sin(elapsedTime * 0.9) * 0.14;
            const idleX = Math.cos(elapsedTime * 1.2) * 0.05;
            headGroup.rotation.y += (idleY - headGroup.rotation.y) * 0.04;
            headGroup.rotation.x += (idleX - headGroup.rotation.x) * 0.04;
        }

        headGroup.updateMatrixWorld(true);
        socketAnchor.getWorldPosition(socketWorldPos);

        wristBall.position.copy(socketWorldPos);

        const midX = Math.max(socketWorldPos.x + 1.0, (socketWorldPos.x + rightEdgeX) * 0.48);
        const midY = 0.88 + bobY * 0.35;
        const midZ = -0.22;
        midJointPos.set(midX, midY, midZ);
        midJointGroup.position.copy(midJointPos);

        mountPos.set(rightEdgeX + 0.9, -0.35, -0.28);

        positionSegment(innerBoom, midJointPos, socketWorldPos);
        positionSegment(outerBoom, mountPos, midJointPos);

        renderer.render(scene, camera);
    }
    animate();
}

function initMintSnapLogo() {
    const canvas = document.getElementById('project-logo-canvas');
    const container = document.querySelector('.project-logo');
    if (!canvas || !container) return;
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';

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

function initCalculatorLogo() {
    const canvas = document.getElementById('project-calculator-canvas');
    const projectCard = canvas ? canvas.closest('.project-card') : null;
    const container = canvas ? canvas.parentElement : null;
    if (!canvas || !container) return;
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';

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

    const calcGroup = new THREE.Group();
    scene.add(calcGroup);

    const bodyW = 1.84;
    const bodyH = 2.7;
    const r = 0.18;
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-bodyW / 2 + r, -bodyH / 2);
    bodyShape.lineTo(bodyW / 2 - r, -bodyH / 2);
    bodyShape.quadraticCurveTo(bodyW / 2, -bodyH / 2, bodyW / 2, -bodyH / 2 + r);
    bodyShape.lineTo(bodyW / 2, bodyH / 2 - r);
    bodyShape.quadraticCurveTo(bodyW / 2, bodyH / 2, bodyW / 2 - r, bodyH / 2);
    bodyShape.lineTo(-bodyW / 2 + r, bodyH / 2);
    bodyShape.quadraticCurveTo(-bodyW / 2, bodyH / 2, -bodyW / 2, bodyH / 2 - r);
    bodyShape.lineTo(-bodyW / 2, -bodyH / 2 + r);
    bodyShape.quadraticCurveTo(-bodyW / 2, -bodyH / 2, -bodyW / 2 + r, -bodyH / 2);

    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 2
    });
    bodyGeo.center();

    const darkMat = new THREE.MeshBasicMaterial({
        color: 0x141414,
        transparent: true,
        opacity: 0.88,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
    });
    const orangeWireMat = new THREE.MeshBasicMaterial({
        color: 0xff5b14,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    const orangeLineMat = new THREE.LineBasicMaterial({
        color: 0xff5b14,
        linewidth: 2
    });
    const brightLineMat = new THREE.LineBasicMaterial({
        color: 0xff8547,
        linewidth: 2
    });

    calcGroup.add(new THREE.Mesh(bodyGeo, darkMat));
    calcGroup.add(new THREE.Mesh(bodyGeo, orangeWireMat));
    calcGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo, 20), orangeLineMat));

    const solarGeo = new THREE.BoxGeometry(1.1, 0.16, 0.02);
    const solarMesh = new THREE.Mesh(solarGeo, new THREE.MeshBasicMaterial({ color: 0x0d0d0d }));
    solarMesh.position.set(0, 1.05, 0.13);
    calcGroup.add(solarMesh);
    const solarEdges = new THREE.LineSegments(new THREE.EdgesGeometry(solarGeo), orangeLineMat);
    solarEdges.position.copy(solarMesh.position);
    calcGroup.add(solarEdges);

    const solarGridPts = [];
    [-0.33, 0, 0.33].forEach(x => {
        solarGridPts.push(new THREE.Vector3(x, 1.05 - 0.08, 0.141));
        solarGridPts.push(new THREE.Vector3(x, 1.05 + 0.08, 0.141));
    });
    const solarLinesGeo = new THREE.BufferGeometry().setFromPoints(solarGridPts);
    calcGroup.add(new THREE.LineSegments(solarLinesGeo, brightLineMat));

    const screenGeo = new THREE.BoxGeometry(1.45, 0.42, 0.02);
    const screenMesh = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ color: 0x050505 }));
    screenMesh.position.set(0, 0.72, 0.13);
    calcGroup.add(screenMesh);
    const screenEdges = new THREE.LineSegments(new THREE.EdgesGeometry(screenGeo), brightLineMat);
    screenEdges.position.copy(screenMesh.position);
    calcGroup.add(screenEdges);

    const readoutPts = [];
    function addSeg(x1, y1, x2, y2) {
        readoutPts.push(new THREE.Vector3(x1, y1, 0.142));
        readoutPts.push(new THREE.Vector3(x2, y2, 0.142));
    }
    function drawDigit(cx, cy, w, h, segs) {
        const xL = cx - w / 2, xR = cx + w / 2;
        const yB = cy - h / 2, yM = cy, yT = cy + h / 2;
        if (segs.includes('a')) addSeg(xL, yT, xR, yT);
        if (segs.includes('b')) addSeg(xR, yM, xR, yT);
        if (segs.includes('c')) addSeg(xR, yB, xR, yM);
        if (segs.includes('d')) addSeg(xL, yB, xR, yB);
        if (segs.includes('e')) addSeg(xL, yB, xL, yM);
        if (segs.includes('f')) addSeg(xL, yM, xL, yT);
        if (segs.includes('g')) addSeg(xL, yM, xR, yM);
    }
    const dw = 0.13, dh = 0.24, dy = 0.72;
    drawDigit(-0.48, dy, dw, dh, ['a', 'b', 'c', 'e', 'f', 'g']);
    addSeg(-0.29, dy, -0.21, dy);
    addSeg(-0.25, dy - 0.04, -0.25, dy + 0.04);
    drawDigit(0.05, dy, dw, dh, ['f', 'g', 'b', 'c']);
    addSeg(0.18, dy - dh / 2, 0.19, dy - dh / 2);
    drawDigit(0.36, dy, dw, dh, ['a', 'b', 'c', 'd', 'e', 'f']);

    const readoutGeo = new THREE.BufferGeometry().setFromPoints(readoutPts);
    calcGroup.add(new THREE.LineSegments(readoutGeo, brightLineMat));

    const keyGeo = new THREE.BoxGeometry(0.28, 0.18, 0.08);
    const keyEdgesGeo = new THREE.EdgesGeometry(keyGeo);
    const keyDarkMat = new THREE.MeshBasicMaterial({ color: 0x181818 });
    const keyAccentMat = new THREE.MeshBasicMaterial({ color: 0x2a140a });

    const keySymbolsPts = [];
    function addKeySym(x1, y1, x2, y2) {
        keySymbolsPts.push(new THREE.Vector3(x1, y1, 0.182));
        keySymbolsPts.push(new THREE.Vector3(x2, y2, 0.182));
    }

    const cols = [-0.51, -0.17, 0.17, 0.51];
    const rows = [0.34, 0.08, -0.18, -0.44, -0.70];

    rows.forEach((ry, rIdx) => {
        cols.forEach((cx, cIdx) => {
            const isOp = cIdx === 3 || rIdx === 0;
            const kMesh = new THREE.Mesh(keyGeo, isOp ? keyAccentMat : keyDarkMat);
            kMesh.position.set(cx, ry, 0.14);
            calcGroup.add(kMesh);

            const kEdge = new THREE.LineSegments(keyEdgesGeo, isOp ? brightLineMat : orangeLineMat);
            kEdge.position.copy(kMesh.position);
            calcGroup.add(kEdge);

            const sw = 0.06, sh = 0.06;
            if (cIdx === 3) {
                if (rIdx === 0) {
                    addKeySym(cx - sw, ry, cx + sw, ry);
                    addKeySym(cx, ry + 0.035, cx, ry + 0.035);
                    addKeySym(cx, ry - 0.035, cx, ry - 0.035);
                } else if (rIdx === 1) {
                    addKeySym(cx - sw, ry - sh, cx + sw, ry + sh);
                    addKeySym(cx - sw, ry + sh, cx + sw, ry - sh);
                } else if (rIdx === 2) {
                    addKeySym(cx - sw, ry, cx + sw, ry);
                } else if (rIdx === 3) {
                    addKeySym(cx - sw, ry, cx + sw, ry);
                    addKeySym(cx, ry - sh, cx, ry + sh);
                } else if (rIdx === 4) {
                    addKeySym(cx - sw, ry + 0.025, cx + sw, ry + 0.025);
                    addKeySym(cx - sw, ry - 0.025, cx + sw, ry - 0.025);
                }
            } else if (rIdx === 4 && cIdx === 2) {
                addKeySym(cx - sw, ry + 0.025, cx + sw, ry + 0.025);
                addKeySym(cx - sw, ry - 0.025, cx + sw, ry - 0.025);
            } else if (rIdx === 4 && cIdx === 1) {
                addKeySym(cx - 0.01, ry - sh / 2, cx + 0.01, ry - sh / 2);
            } else if (rIdx === 0 && cIdx === 0) {
                addKeySym(cx + sw, ry + sh, cx - sw, ry + sh);
                addKeySym(cx - sw, ry + sh, cx - sw, ry - sh);
                addKeySym(cx - sw, ry - sh, cx + sw, ry - sh);
            } else {
                addKeySym(cx - sw, ry - sh, cx + sw, ry - sh);
                addKeySym(cx, ry - sh, cx, ry + sh);
            }
        });
    });

    const keySymbolsGeo = new THREE.BufferGeometry().setFromPoints(keySymbolsPts);
    calcGroup.add(new THREE.LineSegments(keySymbolsGeo, orangeLineMat));

    const backZ = -0.142;
    const orangeSolidMat = new THREE.MeshBasicMaterial({ color: 0xff5b14 });
    const brightSolidMat = new THREE.MeshBasicMaterial({ color: 0xff8547 });

    const backFrameGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.52, 2.34, 0.01));
    const backFrame = new THREE.LineSegments(backFrameGeo, orangeLineMat);
    backFrame.position.set(0, 0, backZ);
    calcGroup.add(backFrame);

    [0.92, 0.78, 0.64, 0.50].forEach((vy) => {
        const ventGeo = new THREE.BoxGeometry(1.18, 0.055, 0.015);
        const ventMesh = new THREE.Mesh(ventGeo, orangeSolidMat);
        ventMesh.position.set(0, vy, backZ - 0.005);
        calcGroup.add(ventMesh);
    });

    const battGeo = new THREE.BoxGeometry(1.22, 0.96, 0.02);
    const battMesh = new THREE.Mesh(battGeo, new THREE.MeshBasicMaterial({ color: 0x0e0e0e }));
    battMesh.position.set(0, -0.48, backZ - 0.006);
    calcGroup.add(battMesh);
    const battEdges = new THREE.LineSegments(new THREE.EdgesGeometry(battGeo), brightLineMat);
    battEdges.position.copy(battMesh.position);
    calcGroup.add(battEdges);

    const latchGeo = new THREE.BoxGeometry(0.36, 0.07, 0.025);
    const latchMesh = new THREE.Mesh(latchGeo, brightSolidMat);
    latchMesh.position.set(0, -0.04, backZ - 0.012);
    calcGroup.add(latchMesh);

    const emblemPts = [
        new THREE.Vector3(0, -0.24, backZ - 0.018),
        new THREE.Vector3(0.24, -0.48, backZ - 0.018),
        new THREE.Vector3(0, -0.72, backZ - 0.018),
        new THREE.Vector3(-0.24, -0.48, backZ - 0.018)
    ];
    calcGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(emblemPts), brightLineMat));

    const screwGeo = new THREE.RingGeometry(0.028, 0.05, 12);
    [[-0.64, 1.06], [0.64, 1.06], [-0.64, -1.06], [0.64, -1.06]].forEach(([sx, sy]) => {
        const screw = new THREE.Mesh(screwGeo, orangeSolidMat);
        screw.rotation.y = Math.PI;
        screw.position.set(sx, sy, backZ - 0.003);
        calcGroup.add(screw);
    });

    calcGroup.position.set(0, -0.05, 0);

    let targetRotX = 0;
    let targetRotY = 0;
    let isHovered = false;

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
    function animateCalc() {
        requestAnimationFrame(animateCalc);
        const elapsedTime = clock.getElapsedTime();

        const speed = isHovered ? 0.025 : 0.012;
        calcGroup.rotation.y += speed;

        calcGroup.position.y = -0.05 + Math.sin(elapsedTime * 2 + 1.2) * 0.06;

        if (isHovered) {
            calcGroup.rotation.x += (targetRotX - calcGroup.rotation.x) * 0.08;
            calcGroup.rotation.z += (-targetRotY * 0.3 - calcGroup.rotation.z) * 0.08;
        } else {
            const idleRotX = Math.sin(elapsedTime * 1.2 + 0.8) * 0.12;
            const idleRotZ = Math.cos(elapsedTime * 0.9 + 0.8) * 0.06;
            calcGroup.rotation.x += (idleRotX - calcGroup.rotation.x) * 0.05;
            calcGroup.rotation.z += (idleRotZ - calcGroup.rotation.z) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animateCalc();
}

function initUnoFlipLogo() {
    const canvas = document.getElementById('project-uno-canvas');
    const cardEl = document.getElementById('uno-flip-card');
    const container = cardEl ? cardEl.querySelector('.project-logo') : null;
    if (!canvas || !container) return;
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

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

    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    function createCardShape(w, h, r) {
        const s = new THREE.Shape();
        const x = -w / 2;
        const y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r);
        s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h);
        s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r);
        s.quadraticCurveTo(x, y, x + r, y);
        return s;
    }

    const cardShape = createCardShape(1.56, 2.34, 0.18);
    const cardGeo = new THREE.ExtrudeGeometry(cardShape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
    });
    cardGeo.center();

    const darkBodyMat = new THREE.MeshBasicMaterial({
        color: 0x121212,
        transparent: true,
        opacity: 0.94,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
    });
    const orangeWireMat = new THREE.MeshBasicMaterial({
        color: 0xff5b14,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    const orangeLineMat = new THREE.LineBasicMaterial({ color: 0xff5b14 });
    const brightLineMat = new THREE.LineBasicMaterial({ color: 0xff8547 });

    cardGroup.add(new THREE.Mesh(cardGeo, darkBodyMat));
    cardGroup.add(new THREE.Mesh(cardGeo, orangeWireMat));
    cardGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(cardGeo, 20), orangeLineMat));

    function addInnerFrame(zPos, mat) {
        const frameShape = createCardShape(1.36, 2.12, 0.12);
        const pts = frameShape.getPoints(48).map(p => new THREE.Vector3(p.x, p.y, zPos));
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        cardGroup.add(new THREE.LineLoop(geo, mat));
    }

    function addTiltedOval(zPos, mat, rx, ry) {
        const curve = new THREE.EllipseCurve(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
        const pts2D = curve.getPoints(48);
        const tilt = 0.42;
        const cosT = Math.cos(tilt);
        const sinT = Math.sin(tilt);
        const pts3D = pts2D.map(p => new THREE.Vector3(
            p.x * cosT - p.y * sinT,
            p.x * sinT + p.y * cosT,
            zPos
        ));
        const geo = new THREE.BufferGeometry().setFromPoints(pts3D);
        cardGroup.add(new THREE.LineLoop(geo, mat));
    }

    function addArcArrow(cx, cy, r, startA, endA, zPos, mat, arrowAtEnd) {
        const pts = [];
        const segs = 18;
        for (let i = 0; i <= segs; i++) {
            const a = startA + (endA - startA) * (i / segs);
            pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, zPos));
        }
        cardGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));

        const tipAngle = arrowAtEnd ? endA : startA;
        const tx = cx + Math.cos(tipAngle) * r;
        const ty = cy + Math.sin(tipAngle) * r;
        const dir = endA > startA ? 1 : -1;
        const tangent = tipAngle + dir * (Math.PI / 2);
        const headSize = 0.11;
        const a1 = tangent - 2.55;
        const a2 = tangent + 2.55;
        const headPts = [
            new THREE.Vector3(tx + Math.cos(a1) * headSize, ty + Math.sin(a1) * headSize, zPos),
            new THREE.Vector3(tx, ty, zPos),
            new THREE.Vector3(tx + Math.cos(a2) * headSize, ty + Math.sin(a2) * headSize, zPos)
        ];
        cardGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(headPts), mat));
    }

    function addMiniFlipIcon(cx, cy, zPos, mat) {
        addArcArrow(cx, cy, 0.085, 0.25, Math.PI - 0.15, zPos, mat, true);
        addArcArrow(cx, cy, 0.085, Math.PI + 0.25, Math.PI * 2 - 0.15, zPos, mat, true);
    }

    const frontZ = 0.048;
    addInnerFrame(frontZ, orangeLineMat);
    addTiltedOval(frontZ, orangeLineMat, 0.60, 0.92);
    addTiltedOval(frontZ, brightLineMat, 0.53, 0.84);
    addArcArrow(0, 0, 0.34, 0.35, Math.PI - 0.25, frontZ + 0.004, brightLineMat, true);
    addArcArrow(0, 0, 0.34, Math.PI + 0.35, Math.PI * 2 - 0.25, frontZ + 0.004, brightLineMat, true);
    addMiniFlipIcon(-0.50, 0.86, frontZ + 0.002, brightLineMat);
    addMiniFlipIcon(0.50, -0.86, frontZ + 0.002, brightLineMat);

    const backZ = -0.048;
    addInnerFrame(backZ, brightLineMat);
    addTiltedOval(backZ, orangeLineMat, 0.60, 0.92);

    const backPts = [];
    function addBackSeg(x1, y1, x2, y2) {
        backPts.push(new THREE.Vector3(x1, y1, backZ - 0.004));
        backPts.push(new THREE.Vector3(x2, y2, backZ - 0.004));
    }
    addBackSeg(0.16, 0.0, 0.34, 0.0);
    addBackSeg(0.25, -0.10, 0.25, 0.10);
    addBackSeg(-0.02, 0.22, -0.26, 0.22);
    addBackSeg(-0.02, 0.22, -0.02, 0.02);
    addBackSeg(-0.02, 0.02, -0.26, 0.02);
    addBackSeg(-0.26, 0.02, -0.26, -0.22);
    addBackSeg(-0.26, -0.22, -0.02, -0.22);

    addBackSeg(0.56, 0.86, 0.44, 0.86);
    addBackSeg(0.50, 0.80, 0.50, 0.92);
    addBackSeg(-0.44, -0.86, -0.56, -0.86);
    addBackSeg(-0.50, -0.80, -0.50, -0.92);

    cardGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(backPts), brightLineMat));

    cardGroup.rotation.z = -0.1;

    let targetRotX = 0;
    let targetRotZ = -0.1;
    let isHovered = false;

    if (cardEl) {
        cardEl.addEventListener('mouseenter', () => { isHovered = true; });
        cardEl.addEventListener('mouseleave', () => {
            isHovered = false;
            targetRotX = 0;
            targetRotZ = -0.1;
        });
        cardEl.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            targetRotX = -relY * 0.45;
            targetRotZ = -0.1 - relX * 0.25;
        });
    }

    const clock = new THREE.Clock();
    function animateUno() {
        requestAnimationFrame(animateUno);
        const elapsedTime = clock.getElapsedTime();

        const speed = isHovered ? 0.032 : 0.015;
        cardGroup.rotation.y += speed;
        cardGroup.position.y = Math.sin(elapsedTime * 2 + 0.6) * 0.06;

        if (isHovered) {
            cardGroup.rotation.x += (targetRotX - cardGroup.rotation.x) * 0.08;
            cardGroup.rotation.z += (targetRotZ - cardGroup.rotation.z) * 0.08;
        } else {
            const idleRotX = Math.sin(elapsedTime * 1.1) * 0.14;
            const idleRotZ = -0.1 + Math.cos(elapsedTime * 0.8) * 0.05;
            cardGroup.rotation.x += (idleRotX - cardGroup.rotation.x) * 0.05;
            cardGroup.rotation.z += (idleRotZ - cardGroup.rotation.z) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animateUno();
}

function initPortfolioLogo() {
    const canvas = document.getElementById('project-portfolio-canvas');
    const projectCard = canvas ? canvas.closest('.project-card') : null;
    const container = canvas ? canvas.parentElement : null;
    if (!canvas || !container) return;
    if (canvas.dataset.initialized) return;
    canvas.dataset.initialized = 'true';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

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

    const contactGroup = new THREE.Group();
    scene.add(contactGroup);

    const darkMat = new THREE.MeshBasicMaterial({
        color: 0x141414,
        transparent: true,
        opacity: 0.9,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
    });
    const orangeWireMat = new THREE.MeshBasicMaterial({
        color: 0xff5b14,
        wireframe: true,
        transparent: true,
        opacity: 0.45
    });
    const orangeLineMat = new THREE.LineBasicMaterial({ color: 0xff5b14 });
    const brightLineMat = new THREE.LineBasicMaterial({ color: 0xff8547 });

    const ringGeo = new THREE.TorusGeometry(1.08, 0.055, 14, 48);
    contactGroup.add(new THREE.Mesh(ringGeo, darkMat));
    contactGroup.add(new THREE.Mesh(ringGeo, orangeWireMat));

    const outerCirclePts = [];
    for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        outerCirclePts.push(new THREE.Vector3(Math.cos(a) * 1.14, Math.sin(a) * 1.14, 0));
    }
    contactGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(outerCirclePts), brightLineMat));

    const headGeo = new THREE.SphereGeometry(0.36, 18, 14);
    const headDark = new THREE.Mesh(headGeo, darkMat);
    const headWire = new THREE.Mesh(headGeo, orangeWireMat);
    headDark.position.set(0, 0.34, 0);
    headWire.position.set(0, 0.34, 0);
    contactGroup.add(headDark);
    contactGroup.add(headWire);

    const headHaloGeo = new THREE.TorusGeometry(0.37, 0.015, 10, 32);
    const headHalo = new THREE.Mesh(headHaloGeo, new THREE.MeshBasicMaterial({ color: 0xff8547 }));
    headHalo.position.set(0, 0.34, 0);
    contactGroup.add(headHalo);

    const shoulderShape = new THREE.Shape();
    shoulderShape.moveTo(-0.68, -0.68);
    shoulderShape.quadraticCurveTo(-0.66, -0.14, 0, -0.14);
    shoulderShape.quadraticCurveTo(0.66, -0.14, 0.68, -0.68);
    shoulderShape.quadraticCurveTo(0.36, -0.88, 0, -0.88);
    shoulderShape.quadraticCurveTo(-0.36, -0.88, -0.68, -0.68);

    const shoulderGeo = new THREE.ExtrudeGeometry(shoulderShape, {
        depth: 0.24,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.04,
        bevelSegments: 3
    });
    shoulderGeo.center();

    const shoulderDark = new THREE.Mesh(shoulderGeo, darkMat);
    const shoulderWire = new THREE.Mesh(shoulderGeo, orangeWireMat);
    const shoulderEdges = new THREE.LineSegments(new THREE.EdgesGeometry(shoulderGeo, 20), brightLineMat);
    shoulderDark.position.set(0, -0.48, 0);
    shoulderWire.position.set(0, -0.48, 0);
    shoulderEdges.position.set(0, -0.48, 0);
    contactGroup.add(shoulderDark);
    contactGroup.add(shoulderWire);
    contactGroup.add(shoulderEdges);

    let targetRotX = 0;
    let targetRotY = 0;
    let isHovered = false;

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
    function animateContact() {
        requestAnimationFrame(animateContact);
        const elapsedTime = clock.getElapsedTime();

        const speed = isHovered ? 0.025 : 0.012;
        contactGroup.rotation.y += speed;
        contactGroup.position.y = Math.sin(elapsedTime * 2 + 0.4) * 0.06;

        if (isHovered) {
            contactGroup.rotation.x += (targetRotX - contactGroup.rotation.x) * 0.08;
            contactGroup.rotation.z += (-targetRotY * 0.3 - contactGroup.rotation.z) * 0.08;
        } else {
            const idleRotX = Math.sin(elapsedTime * 1.2) * 0.12;
            const idleRotZ = Math.cos(elapsedTime * 0.9) * 0.06;
            contactGroup.rotation.x += (idleRotX - contactGroup.rotation.x) * 0.05;
            contactGroup.rotation.z += (idleRotZ - contactGroup.rotation.z) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animateContact();
}

window.addEventListener('DOMContentLoaded', () => {
    initAvatar();
    initMintSnapLogo();
    initPortfolioLogo();
    initCalculatorLogo();
    initUnoFlipLogo();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAvatar();
    initMintSnapLogo();
    initPortfolioLogo();
    initCalculatorLogo();
    initUnoFlipLogo();
}
