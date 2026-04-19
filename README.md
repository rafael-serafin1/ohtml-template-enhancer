## HTML Template Enhancer

***oHTML***, a HTML templating layer that eliminates the need for build tools by enabling reusable, component-based structures directly in HTML, reducing complexity in static site development.

## Features

- Create **custom elements** without any external dependencies.  
- Supports **HTML templates** to define the structure of your custom tags.  
- Minimalist API designed for **simplicity and speed**.  
- Easy to integrate into any web project.
- **Two-way data binding** with `model-link` for automatic input synchronization.
- **Conditional rendering** with `o-if` and `show-switch` directives.
- **Dynamic styling** with `class-pointer` and `id-pointer` for utility-based CSS.
- **Event handling** with `o-when` directives for component interaction.
- **Loop rendering** with `o-for` directive for list data.

### How to use it

Clone oHTML repository:<br />
```bash
git clone https://github.com/rafael-serafin1/ohtml-template-enhancer
```

On your HTML file, import code source:
```html
<script type="module" src="ohtml-template-enhancer/core/runtime.js"></script>
```

---

### Basic Usage

Define a `<template>` in your HTML:
```html
<template name-tag="user-card">
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

### Two-Way Data Binding

Synchronize input values with component state automatically:

```html
<template name-tag="search-input">
  <div>
    <input model-link="query" placeholder="Search..."/>
    <p>You searched for: <strong data-bind="query"></strong></p>
  </div>
</template>

<search-input query="javascript"></search-input>
```

Typing in the input updates both the component attribute and the display in real-time.

---

### Conditional Rendering

```html
<template name-tag="logged-card">
  <h3 o-if="isLogged"></h3>                               
  <p show-switch="showDetails"></p>                      
</template>
```

`o-if` removes the element from the DOM when false, while `show-switch` toggles visibility.

```html
<logged-card :isLogged="true" :showDetails="false"></logged-card>
```

---

### Loop Rendering 

```html
<template name-tag="user-list" data-use-shadow="false">
  <ul>
    <li o-for="user in users" class="user-item" id="user.id">
      <h3 data-bind="user.name"></h3>
      <p data-bind="user.email"></p>
    </li>
  </ul>
</template>
```

Dynamic lists are rendered automatically based on array data.

```html
<user-list :users='[
  {"user": "John Doe"}
  {"user": "Daniel Dias"}
]'></user-list>
```

---

### Event Handling with `o-when`

```html
<button o-on:click="handleClick">Click Me</button>

<script>
function handleClick() {
  alert('Button clicked!');
}
</script>
```

Attach events declaratively for cleaner HTML components.

---

### Slot Usage for Flexible Content:

```html
<template name-tag="generic-triple">
  <div><div><div>
    <slot></slot>
  </div></div></div>
</template>

<generic-triple>
  <p>This paragraph is wrapped inside three divs.</p>
</generic-triple>
```

Named slots enable advanced component composition:

```html
<triple-div>
  <h2 slot="title">Rafael</h2>
  <p slot="semi-title">C. Science Student</p>
  <p slot="description">Hi! My name is Rafael and I aspire to become a Software Engineer!</p>
</triple-div>
```

--- 

### Dynamic Assignment with pointers

```html
<template name-tag="user-list" data-use-shadow="false">
  <ul o-if="active">
    <li o-for="user in users" class="user-item" id="user.id">
      <h3 data-bind="user.name" class-pointer="user-name" attr-pointer="user.styling"></h3>
      <p data-bind="user.email" id-pointer="user-email"></p>
    </li>
  </ul>
</template>
```

```html
<user-list :active="true" 
  :users='[
    {"name": "Rafael Engel", "email": "rafael@gmail.com", "styling": {"style": "color: #2563eb; font-weight: bold;", "title": "Full Stack Developer"}},
    {"name": "Daniel Dias", "email": "daniel@gmail.com", "styling": {"style": "color: #dc2626; font-weight: bold;", "title": "Backend Developer"}},
    {"name": "João Silva", "email": "joao@gmail.com", "styling": {"style": "color: #059669; font-weight: bold;", "title": "Frontend Developer"}},
    {"name": "Maria Santos", "email": "maria@gmail.com", "styling": {"style": "color: #7c3aed; font-weight: bold;", "title": "QA Engineer"}}
  ]'
  user-name="user-title"
  user-email="userEmail">
</user-list>
```

`class-pointer`, `id-pointer` and `attr-pointer` allow per-instance customization for styles and DOM references.

## Why Use oHTML?
- Create components without touching JavaScript.
- Keep your HTML clean, readable, and maintainable.
- Rapidly prototype static websites or pages with reusable components.
- Fully compatible with utility-first CSS frameworks.
- Lightweight alternative to full frontend frameworks without sacrificing functionality.

## License

⚖️ MIT License