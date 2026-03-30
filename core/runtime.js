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
     * ? o-if conditional rendering attribute statement (deletes element if false)
     */
    template.content.querySelectorAll('[o-if]').forEach((el) => {
        const attr = el.getAttribute('o-if');
        if (attr) binds.add(attr);
    });
    /**
     *  ? show-switch directive (hiddes element if false)
     */
    template.content.querySelectorAll('[show-switch]').forEach((el) => {
        const attr = el.getAttribute('show-switch');
        if (attr) binds.add(attr);
    });
    /**
     * ? prop-pointer for passing attributes directly to child components (e.g., <child-component prop-pointer="parentData">)
     */
    template.content.querySelectorAll('[prop-pointer]').forEach((el) => {
        const attr = el.getAttribute('prop-pointer');
        if (attr) binds.add(attr);
    });
    /**
     * TODO: o-on event directive for attaching event listeners directly in the template (e.g., o-on:click="handleClick")
     */

    /**
     * ? o-for loop directive (similar to Vue's v-for) for rendering lists based on array data
     */
    template.content.querySelectorAll('[o-for]').forEach((el) => {
        const attr = el.getAttribute('o-for');
        if (attr && attr.includes(' in ')) {
            // Extract array name from "item in arrayName"
            const [itemName, arrayName] = attr.split(' in ').map(s => s.trim());
            binds.add(`${itemName} in ${arrayName}`);
            binds.add(arrayName); // Also add the array name to observe it
        }
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
