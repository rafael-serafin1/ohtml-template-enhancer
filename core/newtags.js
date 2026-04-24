import { nameIsOK } from "./verify.js";

export class NewTags {
  /**
   * ? Used to automatize custom elements definition on runtime
   * @returns Array of objects containing "name" and "class" attributes 
   */
  listTags() {
    const tags = [
      {
        name: "templates-import",
        class: TemplatesImport
      },
      {
        name: "templates-define",
        class: TemplatesDefine
      }
    ]
    return tags;
  }
}

/**
 * ? Creates oHTML special element `<templates-import>` used to do not other thing than importing templates DUUH.
 */
export class TemplatesImport extends HTMLElement {
  async connectedCallback() {
    const src = this.getAttribute("src")

    if (!src) return;

    try {
      const res = await fetch(src);
      const html = await res.text();

      const parser = new DOMParser();

      const doc = parser.parseFromString(html, "text/html");
      const templates = doc.querySelectorAll("template");

      templates.forEach(template => {
        // no dumb duplications
        const name = template.getAttribute("name-tag");

        // templates without `name-tag` are ignored
        if (!name) return;
        
        // handling templates with same name
        if (document.querySelector(`template[name-tag="${name}"]`)) {
          console.warn(`Template '${name}' already exists, ignoring imported one`);
          return;
        }

        document.body.appendChild(template);
      })

    } catch (err) {
      console.error("Error: ", err);
    }
  }
}

/**
 * ? Class for `<templates-define>` custom tag
 */
export const scopedTemplates = new Map();
export class TemplatesDefine extends HTMLElement {
  async connectedCallback() {
    const parentTag = this.getAttribute("scope-name");

    if (!parentTag || !parentTag.includes("-")) throw new Error("[oHTML] scope-name invalid or inexistent.");

    // map scope
    if (!scopedTemplates.has(parentTag)) scopedTemplates.set(parentTag, new Map());

    const scopeMap = scopedTemplates.get(parentTag);

    // colect child templates
    const templates = this.querySelectorAll("template[name-tag]");
    templates.forEach(template => {
        const tagName = template.getAttribute("name-tag");
        if (!nameIsOK(template)) return;

        if (scopeMap.has(tagName)) console.warn(`[oHTML] <templates-define> overriding "${tagName}" to "${parentTag}"`);

        scopeMap.set(tagName, template);
    });
    this.remove();
  }
}

// ignore this
export const getScopedTemplate = (parentTag, childTag) => { return scopedTemplates.get(parentTag)?.get(childTag) || null; }