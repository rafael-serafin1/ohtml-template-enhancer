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
     * @returns {string[]} Lista de atributos observados para re-renderização
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