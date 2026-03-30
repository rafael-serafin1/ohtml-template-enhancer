import "./define.js";
import { defineComponent } from "./libcore.js";

function getTemplateObservedAttributes(template) {
    const binds = new Set();
    template.content.querySelectorAll('[data-bind]').forEach((el) => {
        const attr = el.getAttribute('data-bind');
        if (attr) binds.add(attr);
    });
    // Also detect class-pointer attributes
    template.content.querySelectorAll('[class-pointer]').forEach((el) => {
        const attr = el.getAttribute('class-pointer');
        if (attr) binds.add(attr);
    });
    return [...binds];
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
