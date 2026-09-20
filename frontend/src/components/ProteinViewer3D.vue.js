/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useProteinStore } from '../store/protein';
const store = useProteinStore();
const container = ref();
let scene, camera, renderer;
let controls, animationId;
let backboneGroup = new THREE.Group();
function initScene() {
    if (!container.value)
        return;
    const w = container.value.clientWidth, h = container.value.clientHeight;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 5, 20);
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(3, 2, 6);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.value.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    scene.add(new THREE.AmbientLight(0x404060, 1.5));
    const dl = new THREE.DirectionalLight(0xffffff, 1.2);
    dl.position.set(5, 5, 5);
    scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0x6688cc, 0.6);
    dl2.position.set(-3, -2, -5);
    scene.add(dl2);
    const grid = new THREE.GridHelper(8, 20, 0x444466, 0x222244);
    scene.add(grid);
    scene.add(backboneGroup);
}
function buildBackbone(phi, psi) {
    backboneGroup.clear();
    const bondLen = 1.47;
    const angle = 109.5 * Math.PI / 180;
    let pos = new THREE.Vector3(0, 0, 0);
    let dir = new THREE.Vector3(1, 0, 0);
    const caMat = new THREE.MeshPhongMaterial({ color: 0x44aaff, emissive: 0x112244 });
    const nMat = new THREE.MeshPhongMaterial({ color: 0x3355cc, emissive: 0x111133 });
    const cMat = new THREE.MeshPhongMaterial({ color: 0xff6644, emissive: 0x331111 });
    const bondMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
    const residues = store.result?.params.residues || 8;
    for (let i = 0; i < residues; i++) {
        const nPos = pos.clone();
        const nSphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), nMat);
        nSphere.position.copy(nPos);
        backboneGroup.add(nSphere);
        const caPos = nPos.clone().add(dir.clone().multiplyScalar(0.49));
        const caSphere = new THREE.Mesh(new THREE.SphereGeometry(0.30, 16, 16), caMat);
        caSphere.position.copy(caPos);
        backboneGroup.add(caSphere);
        const cPos = caPos.clone().add(dir.clone().multiplyScalar(0.53));
        const cSphere = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), cMat);
        cSphere.position.copy(cPos);
        backboneGroup.add(cSphere);
        for (const [a, b] of [[nPos, caPos], [caPos, cPos]]) {
            const mid = a.clone().add(b).multiplyScalar(0.5);
            const dist = a.distanceTo(b);
            const bondGeom = new THREE.CylinderGeometry(0.07, 0.07, dist, 8);
            const bond = new THREE.Mesh(bondGeom, bondMat);
            bond.position.copy(mid);
            const bLocal = b.clone().sub(a).normalize();
            bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bLocal);
            backboneGroup.add(bond);
        }
        const nextDir = dir.clone();
        nextDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle - Math.PI / 2);
        nextDir.applyAxisAngle(dir, psi * Math.PI / 180);
        pos = cPos.clone().add(nextDir.clone().multiplyScalar(0.49));
        dir = nextDir;
    }
    const box = new THREE.Box3().setFromObject(backboneGroup);
    const center = new THREE.Vector3();
    box.getCenter(center);
    backboneGroup.position.sub(center);
}
function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    backboneGroup.rotation.y += 0.001;
    renderer.render(scene, camera);
}
function onResize() {
    if (!container.value)
        return;
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
    camera.aspect = container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
}
onMounted(() => {
    initScene();
    buildBackbone(-60, -45);
    animate();
    window.addEventListener('resize', onResize);
});
watch(() => store.selectedConformation, (conf) => {
    if (conf)
        buildBackbone(conf.phi, conf.psi);
});
onUnmounted(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    renderer?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "container",
    ...{ class: "viewer3d" },
});
/** @type {typeof __VLS_ctx.container} */ ;
if (__VLS_ctx.store.selectedConformation) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "info" },
    });
    (__VLS_ctx.store.selectedConformation.phi.toFixed(1));
    (__VLS_ctx.store.selectedConformation.psi.toFixed(1));
    (__VLS_ctx.store.selectedConformation.energy.toFixed(2));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "info" },
    });
}
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['viewer3d']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            container: container,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
