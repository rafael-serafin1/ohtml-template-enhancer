import { BaseComponent } from "./base.js";
import { getScopedTemplate } from "./newtags.js";
import { parseAttribute } from "./parsing.js";
import { scopedTemplates } from "./newtags.js";

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

        /**
         * Override attributeChangedCallback to prevent re-render during model-link updates
         * This prevents loss of focus when typing in inputs with model-link
         */
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return;

            // Check if this attribute is bound to a model-link input
            const root = this.shadowRoot || this;
            const hasModelLink = root.querySelector(`[model-link="${name}"]`);

            if (hasModelLink && this._isModelLinkUpdate) {
                // Skip full re-render during model-link updates
                // Instead, only update data-bind elements
                this._updateDataBindings(root, name, newValue);
                return;
            }

            // Normal re-render for other attribute changes
            this.render();
        }

        /**
         * Update only data-bind elements without full re-render
         * This preserves input focus and cursor position
         */
        _updateDataBindings(root, attrName, attrValue) {
            const { value: parsedValue, isParsed } = parseAttribute(
                this.hasAttribute(`:${attrName}`) ? `:${attrName}` : attrName,
                attrValue
            );

            // Update all data-bind elements for this attribute
            root.querySelectorAll(`[data-bind="${attrName}"]`).forEach(el => {
                el.textContent = isParsed ? JSON.stringify(parsedValue) : (parsedValue ?? "");
            });

            // Update class-pointer elements
            root.querySelectorAll(`[class-pointer="${attrName}"]`).forEach(el => {
                if (parsedValue) {
                    el.className = String(parsedValue);
                }
            });

            // Update id-pointer elements
            root.querySelectorAll(`[id-pointer="${attrName}"]`).forEach(el => {
                if (parsedValue) {
                    el.id = String(parsedValue);
                }
            });

            root.querySelectorAll(`[attr-define="${attrName}"]`).forEach(el => {
                if (parsedValue) {
                    el.setAttribute(attrName, String(parsedValue));
                }
            });

            // Update internal component data
            if (!this._componentData) {
                this._componentData = {};
            }
            this._componentData[attrName] = parsedValue;
        }

        render() {
            // searchs for template by using custom attribute `name-tag`
            const template = document.querySelector(`template[name-tag="${name}"]`);

            const definesList = template.getAttribute("attr-define");

            if (definesList) {
                const defines = definesList.split(",").map(s => s.trim());
                defines.forEach(attr => {
                    // if already has this attribute
                    if (this.hasAttribute(attr)) return;
                    if (this.hasAttribute(`:${attr}`)) return;

                    // define as empty by default
                    this.setAttribute(attr, "");
                });
            }

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
                this._processScopedComponents(this);
            }
        }

        applyAttributes(root) {
            // handle o-for loops
            this._processForLoops(root);
            
            // handle regular bindings
            observedAttributes.forEach(attr => {
                // Skip o-for attributes as they're handled separately
                if (attr.includes(" in ")) return;

                // Check if there's a prefixed version of this attribute
                const prefixedAttr = `:${attr}`;
                let rawValue;
                
                if (this.hasAttribute(prefixedAttr)) 
                    rawValue = this.getAttribute(prefixedAttr);
                else 
                    rawValue = this.getAttribute(attr);
                
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
                
                // Apply attr-define attributes
                root.querySelectorAll(`[attr-define="${attr}"]`).forEach(el => {
                    if (parsedValue) {
                        el.setAttribute(`${attr}`, `${String(parsedValue)}`);
                    }
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

                // Apply show-switch directive 
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
                if (!this._componentData) this._componentData = {};
                this._componentData[attr] = parsedValue;
            });

            // handle attr-pointer attributes dynamically
            this._applyAttrPointers(root);

            // handle attr-define new tag's attribute
            this._applyAttrDefines(root);

            // handle name-bind attributes for slots
            this._applyNameBindings(root);

            // handle model-link two-way binding
            this._applyModelLink(root);

            // setup event listeners
            this._setupEventListeners();
        }

        /**
         * 
         */
        _applyAttrDefines(root) {
            root.querySelectorAll('[attr-define]').forEach(el => {
                const definesList = el.getAttribute('attr-define');
                if (!definesList) return;

                const defines = definesList.split(",").map(s => s.trim());
                defines.forEach(define => {
                    const defined = `:${define}`;
                    let rawValue;

                    if (this.hasAttribute(defined)) rawValue = this.getAttribute(defined);
                    else rawValue = this.getAttribute(define);

                    if (rawValue == null) return;

                    const {value: parsedValue} = parseAttribute(
                        this.hasAttribute(defined) ? defined : define,
                        rawValue
                    );

                    const newAttr = define;
                    if (typeof parsedValue === "string") {
                        el.setAttribute(`${newAttr}`, `${rawValue}`); 
                    } else 
                        el.setAttribute(`${newAttr}`, `${String(rawValue)}`);
                });
            });
        }

        /**
         * Apply attr-pointer attributes dynamically
         * Syntax: attr-pointer="style-name, title-name, class-name"
         * Maps component attributes to element attributes based on suffix
         */
        _applyAttrPointers(root) {
            root.querySelectorAll('[attr-pointer]').forEach(el => {
                const pointerList = el.getAttribute('attr-pointer');
                if (!pointerList) return;

                // Split by comma and process each pointer
                const pointerNames = pointerList.split(',').map(s => s.trim());
                
                pointerNames.forEach(pointerName => {
                    // Try to get attribute from component (check both prefixed and non-prefixed)
                    const prefixedName = `:${pointerName}`;
                    let rawValue;
                    
                    if (this.hasAttribute(prefixedName)) 
                        rawValue = this.getAttribute(prefixedName);
                    else 
                        rawValue = this.getAttribute(pointerName);
                    
                    if (rawValue === null) return;
                    
                    // Parse the value if prefixed
                    const { value: parsedValue } = parseAttribute(
                        this.hasAttribute(prefixedName) ? prefixedName : pointerName,
                        rawValue
                    );
                    
                    // Extract the attribute name from the last part of pointerName
                    // e.g., "name-style" -> "style", "email-title" -> "title"
                    const parts = pointerName.split('-');
                    const attrName = parts[parts.length - 1]; // Get the last part
                    
                    // Apply the attribute based on its type
                    if (attrName === 'style' && typeof parsedValue === 'string') 
                        el.style.cssText = parsedValue;
                    else if (attrName === 'class' && typeof parsedValue === 'string') 
                        el.className = parsedValue;
                    else if (attrName === 'id' && typeof parsedValue === 'string') 
                        el.id = parsedValue;
                    else 
                        el.setAttribute(attrName, String(parsedValue));
                });
            });
        }

        /**
         * Apply name-bind attributes to slot elements
         * Syntax: name-bind="slotName"
         * Maps component attribute values to slot name attribute
         */
        _applyNameBindings(root) {
            root.querySelectorAll('[name-bind]').forEach(el => {
                const pointerName = el.getAttribute('name-bind');
                if (!pointerName) return;

                // Try to get attribute from component (check both prefixed and non-prefixed)
                const prefixedName = `:${pointerName}`;
                let rawValue;
                
                if (this.hasAttribute(prefixedName))
                    rawValue = this.getAttribute(prefixedName);
                else
                    rawValue = this.getAttribute(pointerName);
                
                // If no explicit value, use the pointer name as the slot name (literal value)
                if (rawValue === null) rawValue = pointerName;
                
                // Parse the value if prefixed
                const { value: parsedValue } = parseAttribute(
                    this.hasAttribute(prefixedName) ? prefixedName : pointerName,
                    rawValue
                );
                
                // Set the slot name attribute
                el.setAttribute('name', String(parsedValue));
            });
        }

        /**
         * Apply model-link two-way binding for input elements
         * Syntax: <input model-link="propertyName">
         * Synchronizes: component attribute <-> input value
         */
        _applyModelLink(root) {
            root.querySelectorAll('[model-link]').forEach(inputEl => {
                const propName = inputEl.getAttribute('model-link');
                if (!propName) return;

                // Only process input-like elements
                if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(inputEl.tagName)) {
                    console.warn(
                        `[oHTML model-link Warning] model-link is only supported on INPUT, TEXTAREA, or SELECT elements. ` +
                        `Found on ${inputEl.tagName}`
                    );
                    return;
                }

                // Get current attribute value (check both prefixed and non-prefixed)
                const prefixedName = `:${propName}`;
                let rawValue;
                
                if (this.hasAttribute(prefixedName))
                    rawValue = this.getAttribute(prefixedName);
                else
                    rawValue = this.getAttribute(propName);

                // Initialize input value from component attribute
                if (rawValue !== null) {
                    const { value: parsedValue } = parseAttribute(
                        this.hasAttribute(prefixedName) ? prefixedName : propName,
                        rawValue
                    );
                    // Only update if different to avoid disrupting user interaction
                    const stringValue = String(parsedValue);
                    if (inputEl.value !== stringValue) {
                        inputEl.value = stringValue;
                    }
                }

                // Create and attach input event listener for state synchronization
                // This listener updates the component attribute when input value changes
                const handleInput = () => {
                    // Set flag to skip full re-render during model-link update
                    this._isModelLinkUpdate = true;
                    this.setAttribute(propName, inputEl.value);
                    this._isModelLinkUpdate = false;
                };

                inputEl.addEventListener('input', handleInput);
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
                
                if (this.hasAttribute(prefixedAttr)) 
                    rawValue = this.getAttribute(prefixedAttr);
                else 
                    rawValue = this.getAttribute(arrayName);
                
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
            // Helper function to process directives  
            const processElement = (el) => {
                // Process data-bind attributes
                const bindAttr = el.getAttribute('data-bind');
                if (bindAttr && bindAttr.startsWith(itemName + '.')) {
                    const property = bindAttr.substring((itemName + '.').length);
                    const value = this._getNestedProperty(itemData, property);
                    el.textContent = value ?? "";
                }

                // Process class-pointer attributes
                const classPointerAttr = el.getAttribute('class-pointer');
                if (classPointerAttr && classPointerAttr.startsWith(itemName + '.')) {
                    const property = classPointerAttr.substring((itemName + '.').length);
                    const value = this._getNestedProperty(itemData, property);
                    if (value) el.className = String(value);
                }

                // Process id-pointer attributes
                const idPointerAttr = el.getAttribute('id-pointer');
                if (idPointerAttr && idPointerAttr.startsWith(itemName + '.')) {
                    const property = idPointerAttr.substring((itemName + '.').length);
                    const value = this._getNestedProperty(itemData, property);
                    if (value) el.id = String(value);
                }

                // Process attr-pointer attributes
                const attrPointerAttr = el.getAttribute('attr-pointer');
                if (attrPointerAttr) {
                    const pointerNames = attrPointerAttr.split(',').map(s => s.trim());
                    
                    pointerNames.forEach(pointerName => {
                        // Check if pointer references item data (e.g., "item.styling")
                        if (pointerName.startsWith(itemName + '.')) {
                            const property = pointerName.substring((itemName + '.').length);
                            const value = this._getNestedProperty(itemData, property);
                            
                            if (value) {
                                // For loop items, the value is the attribute data
                                const parts = pointerName.split('-');
                                const attrName = parts[parts.length - 1];
                                
                                if (attrName === 'style' && typeof value === 'string')
                                    el.style.cssText = value;
                                else if (attrName === 'class' && typeof value === 'string')
                                    el.className = value;
                                else if (attrName === 'id' && typeof value === 'string')
                                    el.id = value;
                                else
                                    el.setAttribute(attrName, String(value));
                            }
                        }
                    });
                }

                // process attr-define attributes
                const attrDefineAttr = el.getAttribute('attr-define');
                if (attrDefineAttr) {
                    const attrs = attrDefineAttr.split(',').map(s => s.trim());

                    attrs.forEach(attr => {
                        if (attr.startsWith('.')) {
                            const property = attr.substring((itemName + '.').length)
                            const value = this._getNestedProperty(itemData, property);

                            if (value) {
                                const parts = attr.split('-');
                                const attrName = parts[parts.length - 1];
        
                                el.setAttribute(attrName, String(value));
                            }
                        }
                    });
                }
            };

            // Process the element itself
            processElement(element);
            
            // Process all child elements
            element.querySelectorAll('[data-bind], [class-pointer], [id-pointer], [attr-pointer], [attr-define]').forEach(el => {
                processElement(el);
            });
        }

        /**
         * Get nested property from object (e.g., "user.profile.name")
         */
        _getNestedProperty(obj, path) {
            return path.split('.').reduce((current, prop) => current?.[prop], obj);
        }

        /**
         * Setup event listeners for o-when directives
         * Syntax: o-when:click="functionName"
         * Supported events: click, dblclick, change, input
         */
        _setupEventListeners() {
            const supportedEvents = ['click', 'dblclick', 'change', 'input'];
            
            supportedEvents.forEach(eventName => {
                const attrName = `o-when:${eventName}`;
                const functionName = this.getAttribute(attrName);
                
                if (functionName) {
                    // Check if the function exists in the global scope
                    const handler = window[functionName];
                    
                    if (typeof handler !== 'function') {
                        console.error(
                            `[oHTML o-when Error] Function "${functionName}" not found in window scope. ` +
                            `Make sure the function is declared globally and is available before the component is initialized.`
                        );
                        return;
                    }
                    
                    // Bind the handler to the component context
                    const boundHandler = handler.bind(this);
                    
                    // Add event listener to the component element
                    this.addEventListener(eventName, boundHandler);
                }
            });
        }

        _processScopedComponents(root) {
            const parentTag = this.tagName.toLowerCase();
            const scope = scopedTemplates.get(parentTag);
            if (!scope) return;

            scope.forEach((template, childTag) => {
                const nodes = Array.from(root.querySelectorAll(childTag));

                nodes.forEach(node => {
                    if (node.__scopedProcessed) return;

                    const fragment = template.content.cloneNode(true);
                    const children = Array.from(fragment.children);

                    children.forEach(child => {
                        Array.from(node.attributes).forEach(attr => {
                            child.setAttribute(attr.name, attr.value);
                        });
                    });

                    if (node.childNodes.length > 0 && children.length > 0) {
                        children[0].append(...node.childNodes);
                    }

                    node.__scopedProcessed = true;
                    node.replaceWith(fragment);
                    this._processScopedComponents(root);
                });
            });
        }
    }
    
    customElements.define(name, Component);
}