import { BaseComponent } from "./base.js";

export function defineComponent(name, options) {
    if (!name.includes("-")) throw new Error("Hyphen is required at tag's name");
    if (customElements.get(name)) return;

    const { templateId, useShadow = true, observedAttributes = [] } = options;

    class Component extends BaseComponent {
        static get observedAttributes() {
            return observedAttributes;
        }

        render() {
            const template = document.getElementById(templateId);
            if (!template) throw new Error(`oHTML couldn't find template: "${templateId}"`);

            const content = template.content.cloneNode(true);

            if (useShadow) {
                if (!this.shadowRoot) {
                    this.attachShadow({ mode: "open" });
                }
                this.shadowRoot.innerHTML = "";
                this.shadowRoot.appendChild(content);
                this.applyAttributes(this.shadowRoot);
            } else {
                this.innerHTML = "";
                this.appendChild(content);
                this.applyAttributes(this);
            }
        }

        applyAttributes(root) {
            observedAttributes.forEach(attr => {
                const value = this.getAttribute(attr);
                root.querySelectorAll(`[data-bind="${attr}"]`).forEach(el => {
                    el.textContent = value ?? "";
                });
            });
        }
    }

    customElements.define(name, Component);
}