import { defineComponent } from "./libcore.js";

/**
 * 
 * @param {*} name 
 * @param {*} templateId 
 * @param {*} options 
 */
export function define(name, templateId, options = {}) {
    if (!name || typeof name !== 'string') throw new Error('Must be a valid string as component name');
    if (!name.includes('-')) throw new Error(`Hyphen is required at tag's name`);

    if (!templateId) templateId = name;
    defineComponent(name, { templateId, ...options });
}

export function defineTemplate(name, templateId, options = {}) {
    define(name, templateId, options);
}

window.define = define;
window.defineTemplate = defineTemplate;
