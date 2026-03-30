import "./define.js";
import { defineComponent } from "./libcore.js";
import { getCleanAttributeNames } from "./parsing.js";

function getTemplateObservedAttributes(template) {
    const binds = new Set();
    /**
     * ? data binding
     */
    template.content.querySelectorAll('[data-bind]').forEach((el) => {
        const attr = el.getAttribute('data-bind');
        if (attr) binds.add(attr);
    });
    /**
     * ? class assignment
     */
    template.content.querySelectorAll('[class-pointer]').forEach((el) => {
        const attr = el.getAttribute('class-pointer');
        if (attr) binds.add(attr);
    });
    /**
     * ? id assignment
     */
    template.content.querySelectorAll('[id-pointer]').forEach((el) => {
        const attr = el.getAttribute('id-pointer');
        if (attr) binds.add(attr);
    });
    /**
     * ? boolean state 
     * ! deprecated and marked for removal in the future
     */
    template.content.querySelectorAll('[boolean-state]').forEach((el) => {
        const attr = el.getAttribute('boolean-state');
        if (attr) binds.add(attr);
    });
    /**
     * ? o-if conditional rendering attribute statement
     */
    template.content.querySelectorAll('[o-if]').forEach((el) => {
        const attr = el.getAttribute('o-if');
        if (attr) binds.add(attr);
    });
    /**
     * ? other bindings can be added here in the future, just remember to add them in the component's render method as well
     */
    
    // get clean attribute names (remove : prefix for observation)
    const cleanBinnds = getCleanAttributeNames(binds);
    
    return [...cleanBinnds];
}

function registerTemplateComponents() {
    document.querySelectorAll('template[id]').forEach((template) => {
        const name = template.id.trim();
        if (!name || !name.includes('-')) return;
        if (customElements.get(name)) return;

        const observedAttributes = getTemplateObservedAttributes(template);
        const useShadow = template.dataset.useShadow !== 'false';

        defineComponent(name, {
            templateId: name,
            observedAttributes,
            useShadow
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerTemplateComponents);
} else {
    registerTemplateComponents();
}

window.registerTemplateComponents = registerTemplateComponents;
