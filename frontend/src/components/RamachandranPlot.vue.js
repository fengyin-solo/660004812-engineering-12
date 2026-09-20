/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted } from "vue";
import { useProteinStore } from "../store/protein";
const store = useProteinStore();
const cvs = ref();
const colors = { "alpha-helix": "#4ecdc4", "beta-sheet": "#ff6b6b", "left-helix": "#45b7d1", "disallowed": "#ddd" };
function draw() {
    const c = cvs.value;
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 1;
    for (let a = -180; a <= 180; a += 30) {
        let x = ((a + 180) / 360) * W;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
        let y = ((a + 180) / 360) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }
    ctx.fillStyle = "rgba(78,205,196,.08)";
    ctx.fillRect(((20) / 360) * W, ((120) / 360) * H, (70 / 360) * W, (70 / 360) * H);
    ctx.fillStyle = "rgba(255,107,107,.08)";
    ctx.fillRect(((225) / 360) * W, ((0) / 360) * H, (120 / 360) * W, (70 / 360) * H);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.fillStyle = "#666";
    ctx.font = "12px sans-serif";
    ctx.fillText("φ →", W - 30, H / 2 - 6);
    ctx.fillText("ψ ↑", W / 2 + 6, 16);
    const confs = (store.result?.conformations || []).filter(c => store.selectedCluster === "all" || c.cluster === store.selectedCluster);
    const es = confs.map(c => c.energy);
    const eMin = Math.min(...es), eMax = Math.max(...es);
    for (const cf of confs) {
        const x = ((cf.phi + 180) / 360) * W, y = H - ((cf.psi + 180) / 360) * H;
        const t = (cf.energy - eMin) / (eMax - eMin || 1), r = 3 + t * 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = colors[cf.region] || "#999";
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,.1)";
        ctx.stroke();
    }
    if (store.selectedConformation) {
        const sc = store.selectedConformation;
        ctx.beginPath();
        ctx.arc(((sc.phi + 180) / 360) * W, H - ((sc.psi + 180) / 360) * H, 8, 0, Math.PI * 2);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
onMounted(draw);
watch(() => [store.result, store.selectedConformation, store.selectedCluster], draw, { deep: true });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['legend']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.canvas, __VLS_intrinsicElements.canvas)({
    ref: "cvs",
    width: "500",
    height: "500",
    ...{ class: "plot-canvas" },
});
/** @type {typeof __VLS_ctx.cvs} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "legend" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot a" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot b" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot l" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot d" },
});
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['plot-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['legend']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['a']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['b']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['l']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['d']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            cvs: cvs,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
