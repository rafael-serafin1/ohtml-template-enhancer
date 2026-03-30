import { BaseComponent } from "./base.js";
import { parseAttribute } from "./parsing.js";

export function defineComponent(name, options) {
    if (!name.includes("-")) throw new Error("Hyphen is required at tag's name");
    if (customElements.get(name)) return;

    const { templateId, useShadow = true, observedAttributes = [] } = options;

    class Component extends BaseComponent {
        static get observedAttributes() {
            return observedAttributes;
        }

        /**
         * Get parsed data value by attribute name
         * @param {string} attrName 
         * @returns {*} The parsed or string value
         */
        getData(attrName) {
            if (!this._componentData) return null;
            return this._componentData[attrName];
        }

        render() {
            const template = document.getElementById(templateId);
            if (!template) throw new Error(`oHTML couldn't find template: "${templateId}"`);

            // clone template's content
            const content = template.content.cloneNode(true);

            if (useShadow) {
                if (!this.shadowRoot) this.attachShadow({ mode: "open" });
                this.shadowRoot.innerHTML = "";
                this.shadowRoot.appendChild(content);

                // apply data-bind
                this.applyAttributes(this.shadowRoot);
            } else {
                // without Shadow DOM, manual slot is needed
                this.innerHTML = "";
                this.appendChild(content);
                this.applyAttributes(this);
            }
        }

        applyAttributes(root) {
            observedAttributes.forEach(attr => {
                // Check if there's a prefixed version of this attribute
                const prefixedAttr = `:${attr}`;
                let rawValue;
                
                if (this.hasAttribute(prefixedAttr)) {
                    rawValue = this.getAttribute(prefixedAttr);
                } else {
                    rawValue = this.getAttribute(attr);
                }
                
                if (rawValue === null) return;
                
                // Parse the attribute value (with prefix if exists)
                const { value: parsedValue, isParsed } = parseAttribute(
                    this.hasAttribute(prefixedAttr) ? prefixedAttr : attr,
                    rawValue
                );
                
                // Apply data-bind attributes
                root.querySelectorAll(`[data-bind="${attr}"]`).forEach(el => {
                    // For parsed values, convert to string for display
                    el.textContent = isParsed ? JSON.stringify(parsedValue) : (parsedValue ?? "");
                });
                
                // Apply class-pointer attributes
                root.querySelectorAll(`[class-pointer="${attr}"]`).forEach(el => {
                    if (parsedValue) {
                        el.className = String(parsedValue);
                    }
                });
                
                // Apply id-pointer attributes
                root.querySelectorAll(`[id-pointer="${attr}"]`).forEach(el => {
                    if (parsedValue) {
                        el.id = String(parsedValue);
                    }
                });
                
                // Get or create a data object on the component to store parsed values
                if (!this._componentData) {
                    this._componentData = {};
                }
                this._componentData[attr] = parsedValue;
            });
        }
    }

    customElements.define(name, Component);
}