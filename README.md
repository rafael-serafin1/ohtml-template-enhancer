## HTML Template Enhancer

***oHTML***, a minimal HTML templating layer that eliminates the need for build tools by enabling reusable, component-based structures directly in HTML, reducing complexity in static site development.

---

### Features

- Create **custom elements** without any external dependencies.  
- Supports **HTML templates** to define the structure of your custom tags.  
- Minimalist API designed for **simplicity and speed**.  
- Easy to integrate into any web project.

---

### How to use it

Clone oHTML repository:<br />
*git clone https://github.com/rafael-serafin1/ohtml-mini-template enhancer*

On your HTML file:
```html
<script type="module" src="ohtml-mini-template enhancer/core/runtime.js"></script>
```

---

### Basic Usage

Define a `<template>` in your HTML:
```html
<template id="user-card">
  <div>
    <h1 data-bind="name"></h1>
    <p data-bind="email"></p>
  </div>
</template>
```

Use the custom tag in your HTML:
```html
<user-card name="Daniel" email="daniel@gmail.com"></user-card>
```
---

### Alternative usage:

```html 
<template id="triple-div">
  <div>
    <div>
      <div>
        <slot></slot> <!-- mandatory tag -->
      </div>
    </div>
  </div>
</template>
```

using it:
```html
<triple-div>
  <p>This paragraph is inside of 3 div's.</p>
</triple-div>
```