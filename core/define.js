import { defineComponent } from "./libcore.js";

/**
 * 
 * @param {*} name 
 * @param {*} templateId 
 * @param {*} options 
 */
export function define(name, templateId, options = {}) {
    if (!verifyName(name) || !verifyValid(name)) return;

    if (!templateId) templateId = name;
    defineComponent(name, { templateId, ...options });
}

export function defineTemplate(name, templateId, options = {}) {
    define(name, templateId, options);
}

window.define = define;
window.defineTemplate = defineTemplate;
