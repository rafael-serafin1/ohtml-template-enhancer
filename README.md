## HTML Template Enhancer

***oHTML***, a minimal HTML templating layer that eliminates the need for build tools by enabling reusable, component-based structures directly in HTML, reducing complexity in static site development.

---

### Features

- Create **custom elements** without any external dependencies.  
- Supports **HTML templates** to define the structure of your custom tags.  
- Minimalist API designed for **simplicity and speed**.  
- Easy to integrate into any web project.
- **Two-way data binding** with `model-link` for automatic input synchronization.
- **Conditional rendering** with `o-if` and `show-switch` directives.
- **Dynamic styling** with `class-pointer` and `id-pointer` for utility-based CSS.
- **Event handling** with `o-when` directives for component interaction.
- **Loop rendering** with `o-for` directive for list data.

---

### How to use it

Clone oHTML repository:<br />
*git clone https://github.com/rafael-serafin1/ohtml-template-enhancer*

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

### Two-Way Data Binding with `model-link`

Synchronize input values with component state automatically:

```html
<template id="search-input">
  <div>
    <input model-link="query" placeholder="Search..."/>
    <p>You searched for: <strong data-bind="query"></strong></p>
  </div>
</template>

<search-input query="javascript"></search-input>
```

When users type in the input, both the component attribute and the display update in real-time.

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