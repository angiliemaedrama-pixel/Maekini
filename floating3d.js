import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// Tune the palette, count, and drift here. Three.js is loaded during browser idle time.
const FLOATING_CONFIG = Object.freeze({
    colors: ["#f3a9c5", "#c8b3ee", "#ffc9b5", "#a9d8ef", "#fff0c7"],
    desktopCount: 32,
    mobileCount: 12,
    driftSpeed: 0.24,
    cursorRepelRadius: 4.2,
    cursorRepelStrength: 1.4,
    maxPixelRatio: 2,
    fov: 45
});

const PALETTE = FLOATING_CONFIG.colors;
const canvas = document.getElementById("floating3dCanvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function createShapeGeometry(kind) {
    const shape = new THREE.Shape();

    if (kind === "heart") {
        shape.moveTo(0, -0.55);
        shape.bezierCurveTo(-0.2, -0.36, -0.65, -0.06, -0.65, 0.31);
        shape.bezierCurveTo(-0.65, 0.75, -0.08, 0.78, 0, 0.42);
        shape.bezierCurveTo(0.08, 0.78, 0.65, 0.75, 0.65, 0.31);
        shape.bezierCurveTo(0.65, -0.06, 0.2, -0.36, 0, -0.55);
    } else {
        const points = 10;
        for (let index = 0; index < points; index += 1) {
            const radius = index % 2 === 0 ? 0.68 : 0.32;
            const angle = (index / points) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (index === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
    }

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth:0.16,
        bevelEnabled:true,
        bevelSegments:2,
        steps:1,
        bevelSize:0.045,
        bevelThickness:0.045
    });
    geometry.center();
    return geometry;
}

function createFlower(THREE, material, sphereGeometry) {
    const flower = new THREE.Group();
    for (let petal = 0; petal < 5; petal += 1) {
        const mesh = new THREE.Mesh(sphereGeometry, material);
        const angle = (petal / 5) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0);
        mesh.scale.set(0.24, 0.39, 0.13);
        mesh.rotation.z = angle - Math.PI / 2;
        flower.add(mesh);
    }
    const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 8),
        new THREE.MeshPhysicalMaterial({
            color:PALETTE[4],
            roughness:0.3,
            clearcoat:0.7
        })
    );
    flower.add(center);
    return flower;
}

function createButterfly(THREE, material, sphereGeometry) {
    const butterfly = new THREE.Group();
    const wings = [];
    for (const side of [-1, 1]) {
        const hinge = new THREE.Group();
        hinge.position.x = side * 0.04;
        const wing = new THREE.Mesh(sphereGeometry, material);
        wing.position.x = side * 0.34;
        wing.scale.set(0.39, 0.52, 0.11);
        hinge.add(wing);
        butterfly.add(hinge);
        wings.push({ hinge, side });
    }
    const body = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({
        color:PALETTE[4],
        roughness:0.45
    }));
    body.scale.set(0.075, 0.43, 0.08);
    butterfly.add(body);
    return { group:butterfly, wings };
}

function createBow(THREE, material, sphereGeometry) {
    const bow = new THREE.Group();
    for (const side of [-1, 1]) {
        const loop = new THREE.Mesh(sphereGeometry, material);
        loop.position.x = side * 0.31;
        loop.scale.set(0.36, 0.24, 0.11);
        loop.rotation.z = side * -0.42;
        bow.add(loop);
    }
    const knot = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial({
        color:PALETTE[0],
        roughness:0.35
    }));
    knot.scale.set(0.15, 0.17, 0.15);
    bow.add(knot);
    return bow;
}

function startFloatingScene() {
    if (!canvas || reducedMotion.matches || !canvas.isConnected) {
        return;
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha:true,
        antialias:window.innerWidth > 700,
        powerPreference:"low-power"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FLOATING_CONFIG.maxPixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        FLOATING_CONFIG.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        120
    );
    camera.position.z = 34;
    scene.add(new THREE.HemisphereLight(0xfff4f4, 0xb5b7d4, 2.2));

    const warmLight = new THREE.DirectionalLight(0xffdfca, 2.5);
    warmLight.position.set(-5, 8, 12);
    scene.add(warmLight);
    const glowLight = new THREE.PointLight(0xffc7e5, 4, 30, 2);
    glowLight.position.set(0, 0, 8);
    scene.add(glowLight);

    const geometries = {
        sphere:new THREE.SphereGeometry(1, 16, 12),
        heart:createShapeGeometry("heart"),
        star:createShapeGeometry("star")
    };
    const materials = PALETTE.map((color) => new THREE.MeshPhysicalMaterial({
        color,
        roughness:0.3,
        metalness:0.03,
        clearcoat:0.7,
        clearcoatRoughness:0.24,
        transparent:true,
        opacity:0.9
    }));
    const kinds = ["heart", "butterfly", "star", "bow", "flower", "sparkle", "bubble", "pearl"];
    const objectCount = window.innerWidth <= 700
        ? FLOATING_CONFIG.mobileCount
        : FLOATING_CONFIG.desktopCount;
    const specs = Array.from({ length:objectCount }, (_, index) => ({
        kind:kinds[index % kinds.length],
        colorIndex:Math.floor(Math.random() * materials.length)
    }));
    const instancedKinds = ["sparkle", "bubble", "pearl"];
    const instanceMeshes = new Map();
    const particles = [];
    const viewport = { halfHeight:1, halfWidth:1 };
    const cursor = { x:Infinity, y:Infinity, active:false };
    const matrix = new THREE.Object3D();

    for (const kind of instancedKinds) {
        const count = specs.filter((spec) => spec.kind === kind).length;
        if (!count) continue;
        const geometry = kind === "sparkle" ? geometries.star : geometries.sphere;
        const material = materials[PALETTE.length - 1];
        const mesh = new THREE.InstancedMesh(geometry, material, count);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.frustumCulled = false;
        scene.add(mesh);
        instanceMeshes.set(kind, { mesh, nextIndex:0 });
    }

    function randomizeParticle(particle, initial = false) {
        const cameraCenterY = camera.position.y;
        particle.x = (Math.random() * 2 - 1) * viewport.halfWidth;
        particle.y = cameraCenterY + (initial
            ? (Math.random() * 2 - 1) * viewport.halfHeight
            : viewport.halfHeight + 1.5);
        particle.z = Math.random() * 11 - 5.5;
        particle.scale = 0.38 + Math.random() * (particle.kind === "heart" ? 0.58 : 0.42);
        particle.rotation = Math.random() * Math.PI * 2;
        particle.rotationSpeed = (Math.random() - 0.5) * 0.24;
        particle.speed = FLOATING_CONFIG.driftSpeed * (0.45 + Math.random() * 1.15);
        particle.phase = Math.random() * Math.PI * 2;
        particle.parallax = (particle.z + 6) * 0.000045;
    }

    for (const spec of specs) {
        const particle = {
            kind:spec.kind,
            colorIndex:spec.colorIndex,
            group:null,
            wings:null,
            mesh:null,
            instanceIndex:-1,
            x:0,
            y:0,
            z:0,
            scale:1,
            rotation:0,
            rotationSpeed:0,
            speed:0,
            phase:0,
            parallax:0
        };

        if (instancedKinds.includes(spec.kind)) {
            const instanced = instanceMeshes.get(spec.kind);
            particle.mesh = instanced.mesh;
            particle.instanceIndex = instanced.nextIndex;
            instanced.nextIndex += 1;
            particle.mesh.setColorAt(particle.instanceIndex, new THREE.Color(PALETTE[spec.colorIndex]));
        } else {
            const material = materials[spec.colorIndex];
            let group;
            if (spec.kind === "heart") {
                group = new THREE.Group();
                group.add(new THREE.Mesh(geometries.heart, material));
            } else if (spec.kind === "star") {
                group = new THREE.Group();
                group.add(new THREE.Mesh(geometries.star, material));
            } else if (spec.kind === "flower") {
                group = createFlower(THREE, material, geometries.sphere);
            } else if (spec.kind === "bow") {
                group = createBow(THREE, material, geometries.sphere);
            } else {
                const butterfly = createButterfly(THREE, material, geometries.sphere);
                group = butterfly.group;
                particle.wings = butterfly.wings;
            }
            scene.add(group);
            particle.group = group;
        }

        randomizeParticle(particle, true);
        particles.push(particle);
    }

    function updateViewport() {
        const height = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        viewport.halfHeight = height / 2;
        viewport.halfWidth = viewport.halfHeight * camera.aspect;
    }

    updateViewport();
    for (const particle of particles) {
        randomizeParticle(particle, true);
    }

    function updateCursor(event) {
        const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = -(event.clientY / window.innerHeight) * 2 + 1;
        const point = new THREE.Vector3(normalizedX, normalizedY, 0).unproject(camera);
        cursor.x = point.x;
        cursor.y = point.y;
        cursor.active = true;
    }

    function clearCursor() {
        cursor.active = false;
    }

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, FLOATING_CONFIG.maxPixelRatio));
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        updateViewport();
    }

    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;
    function animate(now) {
        frame = 0;
        if (document.hidden || reducedMotion.matches) return;

        const delta = Math.min((now - (previousTime || now)) / 1000, 0.05);
        previousTime = now;
        elapsed += delta;
        const scroll = window.scrollY || 0;
        const scrollCenter = Math.min(scroll * 0.00018, 4);
        camera.position.y += (scrollCenter - camera.position.y) * 0.025;
        camera.position.x = Math.sin(elapsed * 0.12) * 0.35;
        glowLight.position.x = Math.sin(elapsed * 0.22) * viewport.halfWidth * 0.65;
        glowLight.position.y = Math.cos(elapsed * 0.18) * viewport.halfHeight * 0.55
            + camera.position.y;

        for (const particle of particles) {
            particle.y += -particle.speed * delta;
            particle.x += Math.sin(elapsed * 0.32 + particle.phase) * delta * 0.18;
            particle.rotation += particle.rotationSpeed * delta;

            if (cursor.active) {
                const dx = particle.x - cursor.x;
                const dy = particle.y - cursor.y;
                const distance = Math.hypot(dx, dy);
                if (distance > 0.01 && distance < FLOATING_CONFIG.cursorRepelRadius) {
                    const force = (1 - distance / FLOATING_CONFIG.cursorRepelRadius)
                        * FLOATING_CONFIG.cursorRepelStrength * delta;
                    particle.x += (dx / distance) * force;
                    particle.y += (dy / distance) * force;
                }
            }

            const verticalOffset = particle.y - camera.position.y;
            if (verticalOffset < -viewport.halfHeight - 1.5) {
                randomizeParticle(particle);
            }

            const bob = Math.sin(elapsed * 0.8 + particle.phase) * 0.18;
            const parallaxY = scroll * particle.parallax;
            if (particle.group) {
                particle.group.position.set(particle.x, particle.y + bob + parallaxY, particle.z);
                particle.group.rotation.set(
                    particle.wings ? Math.sin(elapsed * 2.7 + particle.phase) * 0.1 : 0,
                    Math.sin(elapsed * 0.35 + particle.phase) * 0.1,
                    particle.rotation
                );
                particle.group.scale.setScalar(particle.scale);
                if (particle.wings) {
                    for (const { hinge, side } of particle.wings) {
                        hinge.rotation.y = side * Math.sin(elapsed * 8 + particle.phase) * 0.48;
                    }
                }
            } else {
                matrix.position.set(particle.x, particle.y + bob + parallaxY, particle.z);
                matrix.rotation.set(
                    particle.kind === "sparkle" ? elapsed * 0.15 : 0,
                    particle.rotation * 0.3,
                    particle.rotation
                );
                matrix.scale.setScalar(particle.scale);
                matrix.updateMatrix();
                particle.mesh.setMatrixAt(particle.instanceIndex, matrix.matrix);
            }
        }

        for (const { mesh } of instanceMeshes.values()) {
            mesh.instanceMatrix.needsUpdate = true;
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }

        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
    }

    function resume() {
        if (!document.hidden && !reducedMotion.matches && !frame) {
            previousTime = 0;
            frame = requestAnimationFrame(animate);
        }
    }

    function onVisibilityChange() {
        if (document.hidden) {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
            return;
        }
        resume();
    }

    function onMotionPreferenceChange(event) {
        if (event.matches) {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
            renderer.clear();
            canvas.style.visibility = "hidden";
        } else {
            canvas.style.visibility = "visible";
            resume();
        }
    }

    function cleanup() {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", updateCursor);
        document.removeEventListener("pointerleave", clearCursor);
        window.removeEventListener("blur", clearCursor);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        reducedMotion.removeEventListener?.("change", onMotionPreferenceChange);
        for (const geometry of Object.values(geometries)) geometry.dispose();
        for (const material of materials) material.dispose();
        scene.traverse((object) => {
            if (object.material && !materials.includes(object.material)) {
                object.material.dispose();
            }
        });
        renderer.dispose();
        canvas.remove();
    }

    window.addEventListener("resize", resize, { passive:true });
    window.addEventListener("pointermove", updateCursor, { passive:true });
    document.addEventListener("pointerleave", clearCursor, { passive:true });
    window.addEventListener("blur", clearCursor);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener?.("change", onMotionPreferenceChange);
    window.addEventListener("pagehide", cleanup, { once:true });
    resume();
}

export { startFloatingScene };
