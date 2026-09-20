/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useProteinStore } from '../store/protein';
const store = useProteinStore();
const confs = computed(() => (store.result?.conformations || []).filter(c => store.selectedCluster === 'all' || c.cluster === store.selectedCluster));
function onRowClick(row) { store.selectConformation(row); }
function tagType(r) {
    const m = { 'alpha-helix': 'success', 'beta-sheet': 'danger', 'left-helix': 'warning' };
    return m[r] || 'info';
}
function regionLabel(r) {
    const m = { 'alpha-helix': 'α-螺旋', 'beta-sheet': 'β-折叠', 'left-helix': '左手螺旋', 'disallowed': '禁阻区' };
    return m[r] || r;
}
function exportCSV() {
    const header = 'id,phi,psi,energy,region,cluster\n';
    const rows = confs.value.map(c => `${c.id},${c.phi},${c.psi},${c.energy},${c.region},${c.cluster}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'conformations.csv';
    a.click();
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "table-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
(__VLS_ctx.confs.length);
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.exportCSV)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.confs),
    stripe: true,
    maxHeight: "360",
    highlightCurrentRow: true,
    size: "small",
}));
const __VLS_10 = __VLS_9({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.confs),
    stripe: true,
    maxHeight: "360",
    highlightCurrentRow: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onRowClick: (__VLS_ctx.onRowClick)
};
__VLS_11.slots.default;
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "id",
    label: "ID",
    width: "60",
}));
const __VLS_18 = __VLS_17({
    prop: "id",
    label: "ID",
    width: "60",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "phi",
    label: "φ (°)",
    width: "100",
}));
const __VLS_22 = __VLS_21({
    prop: "phi",
    label: "φ (°)",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_23.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.phi.toFixed(2));
}
var __VLS_23;
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "psi",
    label: "ψ (°)",
    width: "100",
}));
const __VLS_26 = __VLS_25({
    prop: "psi",
    label: "ψ (°)",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_27.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.psi.toFixed(2));
}
var __VLS_27;
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "energy",
    label: "LJ能量 (kcal/mol)",
    width: "150",
}));
const __VLS_30 = __VLS_29({
    prop: "energy",
    label: "LJ能量 (kcal/mol)",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_31.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.energy.toFixed(3));
}
var __VLS_31;
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "region",
    label: "构象区域",
    width: "120",
}));
const __VLS_34 = __VLS_33({
    prop: "region",
    label: "构象区域",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_35.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_36 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        type: (__VLS_ctx.tagType(row.region)),
        size: "small",
    }));
    const __VLS_38 = __VLS_37({
        type: (__VLS_ctx.tagType(row.region)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    (__VLS_ctx.regionLabel(row.region));
    var __VLS_39;
}
var __VLS_35;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "cluster",
    label: "聚类",
}));
const __VLS_42 = __VLS_41({
    prop: "cluster",
    label: "聚类",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            confs: confs,
            onRowClick: onRowClick,
            tagType: tagType,
            regionLabel: regionLabel,
            exportCSV: exportCSV,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
