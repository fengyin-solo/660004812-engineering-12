/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import ControlPanel from "./components/ControlPanel.vue";
import RamachandranPlot from "./components/RamachandranPlot.vue";
import ProteinViewer3D from "./components/ProteinViewer3D.vue";
import ConformationTable from "./components/ConformationTable.vue";
import { useProteinStore } from "./store/protein";
const store = useProteinStore();
function handleSample(params) { store.runSampling(params); }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "app-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "app-main" },
});
if (__VLS_ctx.store.isSampleData) {
    const __VLS_0 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: "当前展示的是内置示例数据（后端未连接）",
        description: "启动后端后点击「生成构象采样」即可获取实时计算结果。启动方式：./scripts/dev.sh",
        ...{ class: "sample-banner" },
    }));
    const __VLS_2 = __VLS_1({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: "当前展示的是内置示例数据（后端未连接）",
        description: "启动后端后点击「生成构象采样」即可获取实时计算结果。启动方式：./scripts/dev.sh",
        ...{ class: "sample-banner" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
/** @type {[typeof ControlPanel, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(ControlPanel, new ControlPanel({
    ...{ 'onSample': {} },
}));
const __VLS_5 = __VLS_4({
    ...{ 'onSample': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
let __VLS_9;
const __VLS_10 = {
    onSample: (__VLS_ctx.handleSample)
};
var __VLS_6;
if (__VLS_ctx.store.result) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "main-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "plot-area" },
    });
    /** @type {[typeof RamachandranPlot, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(RamachandranPlot, new RamachandranPlot({}));
    const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "viewer-area" },
    });
    /** @type {[typeof ProteinViewer3D, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(ProteinViewer3D, new ProteinViewer3D({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
if (__VLS_ctx.store.result) {
    /** @type {[typeof ConformationTable, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(ConformationTable, new ConformationTable({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
/** @type {__VLS_StyleScopedClasses['app-container']} */ ;
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
/** @type {__VLS_StyleScopedClasses['sample-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['main-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['plot-area']} */ ;
/** @type {__VLS_StyleScopedClasses['viewer-area']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ControlPanel: ControlPanel,
            RamachandranPlot: RamachandranPlot,
            ProteinViewer3D: ProteinViewer3D,
            ConformationTable: ConformationTable,
            store: store,
            handleSample: handleSample,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
