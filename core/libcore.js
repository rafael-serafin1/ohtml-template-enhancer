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
            // First pass: handle o-for loops
            this._processForLoops(root);
            
            // Second pass: handle regular bindings
            observedAttributes.forEach(attr => {
                // Skip o-for attributes as they're handled separately
                if (attr.includes(" in ")) return;

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

                /**
                 * ! deprecated and marked for removal in the future, use o-if instead for conditional rendering and class-pointer for class assignment
                 */
                root.querySelectorAll(`[boolean-state="${attr}"]`).forEach(el => {
                    if (typeof parsedValue === "boolean") 
                        if (parsedValue) el.setAttribute(attr, "");
                        else el.removeAttribute(attr);
                });
                
                // Apply o-if conditional rendering
                root.querySelectorAll(`[o-if="${attr}"]`).forEach(el => {
                    // Validate that the value is a boolean
                    if (typeof parsedValue !== "boolean") {
                        console.error(
                            `[oHTML o-if Error] Attribute "${attr}" used in o-if must be a boolean. ` +
                            `Current value is ${typeof parsedValue}. ` +
                            `Use the ":" prefix to enable JSON parsing (e.g., :${attr}="true")`
                        );
                        el.remove(); 
                        return;
                    }
                    
                    if (!parsedValue) el.remove();
                    else el.style.display = ""; // Ensure it's visible if true (in case it was hidden by default)
                });

                root.querySelectorAll(`[show-switch="${attr}"]`).forEach(el => {
                    if (typeof parsedValue !== "boolean") {
                        console.error(
                            `[oHTML o-if Error] Attribute "${attr}" used in o-if must be a boolean. ` +
                            `Current value is ${typeof parsedValue}. ` +
                            `Use the ":" prefix to enable JSON parsing (e.g., :${attr}="true")`
                        );
                        el.style.display = "none";
                        return;
                    }
                    
                    el.style.display = parsedValue ? "" : "none";
                });
                
                // Get or create a data object on the component to store parsed values
                if (!this._componentData) {
                    this._componentData = {};
                }
                this._componentData[attr] = parsedValue;
            });
        }

        /**
         * Process o-for loops by cloning the element itself
         */
        _processForLoops(root) {
            observedAttributes.forEach(attr => {
                if (!attr.includes(" in ")) return;

                const [itemName, arrayName] = attr.split(" in ").map(s => s.trim());
                
                // Get the array from parsed data
                const prefixedAttr = `:${arrayName}`;
                let rawValue;
                
                if (this.hasAttribute(prefixedAttr)) {
                    rawValue = this.getAttribute(prefixedAttr);
                } else {
                    rawValue = this.getAttribute(arrayName);
                }
                
                if (!rawValue) return;

                const { value: arrayData } = parseAttribute(
                    this.hasAttribute(prefixedAttr) ? prefixedAttr : arrayName,
                    rawValue
                );

                if (!Array.isArray(arrayData)) {
                    console.error(
                        `[oHTML o-for Error] "${arrayName}" is not an array. Current value is ${typeof arrayData}`
                    );
                    return;
                }

                // Find all elements with o-for directive
                const forElements = root.querySelectorAll(`[o-for="${attr}"]`);
                
                forElements.forEach(originalEl => {
                    // Get parent to insert clones
                    const parent = originalEl.parentNode;
                    if (!parent) return;
                    
                    // Store position to insert after original
                    let insertRef = originalEl;
                    
                    // Create a clone for each item in the array
                    arrayData.forEach((item, index) => {
                        const clonedEl = originalEl.cloneNode(true);
                        
                        // Remove the o-for attribute from the clone
                        clonedEl.removeAttribute('o-for');
                        
                        // Process all bindings within the cloned element
                        this._processItemBindings(clonedEl, itemName, item);
                        
                        // Insert the clone after the previous element
                        parent.insertBefore(clonedEl, insertRef.nextSibling);
                        insertRef = clonedEl;
                    });
                    
                    // Hide or remove the original template element
                    originalEl.style.display = "none";
                });
            });
        }

        /**
         * Process data-bind attributes for items in o-for loop
         */
        _processItemBindings(element, itemName, itemData) {
            // Process data-bind attributes
            element.querySelectorAll('[data-bind]').forEach(el => {
                const bindAttr = el.getAttribute('data-bind');
                
                // Check if it references the item (e.g., "item.name")
                if (bindAttr.startsWith(itemName + '.')) {
                    const property = bindAttr.substring((itemName + '.').length);
                    const value = this._getNestedProperty(itemData, property);
                    el.textContent = value ?? "";
                }
            });

            // Process class-pointer attributes
            element.querySelectorAll('[class-pointer]').forEach(el => {
                const pointerAttr = el.getAttribute('class-pointer');
                
                // Check if it references the item (e.g., "item.className")
                if (pointerAttr.startsWith(itemName + '.')) {
                    const property = pointerAttr.substring((itemName + '.').length);
                    const value = this._getNestedProperty(itemData, property);
                    if (value) {
                        el.className = String(value);
                    }
                }
            });

            // Process id-pointer attributes
            element.querySelectorAll('[id-pointer]').forEach(el => {
                const pointerAttr = el.getAttribute('id-pointer');
                
                // Check if it references the item (e.g., "item.id")
                if (pointerAttr.startsWith(itemName + '.')) {
                    const property = pointerAttr.substring((itemName + '.').length);
                    const value = this._getNestedProperty(itemData, property);
                    if (value) {
                        el.id = String(value);
                    }
                }
            });
        }

        /**
         * Get nested property from object (e.g., "user.profile.name")
         */
        _getNestedProperty(obj, path) {
            return path.split('.').reduce((current, prop) => current?.[prop], obj);
        }
    }

    customElements.define(name, Component);
}