/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { reactive, ref } from "vue";
import { useProteinStore } from "../store/protein";
const emit = defineEmits();
const store = useProteinStore();
const form = reactive({ residues: 10, conformations: 1000 });
const activeCluster = ref("all");
function emitSample() { emit("sample", { ...form }); }
function onCluster(val) { store.filterByCluster(val); }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control-card" },
});
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.form),
    inline: true,
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.form),
    inline: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "残基数",
}));
const __VLS_6 = __VLS_5({
    label: "残基数",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.form.residues),
    min: (3),
    max: (50),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.form.residues),
    min: (3),
    max: (50),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
const __VLS_12 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "构象数量",
}));
const __VLS_14 = __VLS_13({
    label: "构象数量",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.form.conformations),
    min: (100),
    max: (5000),
    step: (100),
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.form.conformations),
    min: (100),
    max: (5000),
    step: (100),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_15;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.store.loading),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.store.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.emitSample)
};
__VLS_27.slots.default;
var __VLS_27;
const __VLS_32 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    title: "无需后端，直接查看内置示例数据",
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    title: "无需后端，直接查看内置示例数据",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (...[$event]) => {
        __VLS_ctx.store.loadSampleData();
    }
};
__VLS_35.slots.default;
var __VLS_35;
var __VLS_23;
var __VLS_3;
if (__VLS_ctx.store.result) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filters" },
    });
    const __VLS_40 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.activeCluster),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.activeCluster),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onChange: (__VLS_ctx.onCluster)
    };
    __VLS_43.slots.default;
    const __VLS_48 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        label: "all",
    }));
    const __VLS_50 = __VLS_49({
        label: "all",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    var __VLS_51;
    const __VLS_52 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "alpha-helix",
    }));
    const __VLS_54 = __VLS_53({
        label: "alpha-helix",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_56 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        label: "beta-sheet",
    }));
    const __VLS_58 = __VLS_57({
        label: "beta-sheet",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    var __VLS_59;
    const __VLS_60 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "left-helix",
    }));
    const __VLS_62 = __VLS_61({
        label: "left-helix",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    var __VLS_63;
    const __VLS_64 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "disallowed",
    }));
    const __VLS_66 = __VLS_65({
        label: "disallowed",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    var __VLS_67;
    var __VLS_43;
}
/** @type {__VLS_StyleScopedClasses['control-card']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            form: form,
            activeCluster: activeCluster,
            emitSample: emitSample,
            onCluster: onCluster,
        };
    },
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
});
; /* PartiallyEnd: #4569/main.vue */
