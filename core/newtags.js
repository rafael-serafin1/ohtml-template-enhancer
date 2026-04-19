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
        if (!name) {
          return;
        }
        
        // handling templates with same name
        if (document.querySelector(`template[name-tag="${name}"]`)) {
          console.warn(`Template '${name}' already exists, ignoring imported one`);
          return;
        }

        document.body.appendChild(template);
      })

    } catch (err) {
      console.error("Erro ao carregar templates:", err);
    }
  }
}
