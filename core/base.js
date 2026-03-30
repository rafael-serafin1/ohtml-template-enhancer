export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this._mounted = false;
    }

    connectedCallback() {
        if (this._mounted) return;
        this._mounted = true;
        this.render();
    }

    /**
     * Override method to define component's rendering logic
     */
    render() {}

    /**
     * @returns {string[]} List of attributes observed for re-rendering
     */
    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
}