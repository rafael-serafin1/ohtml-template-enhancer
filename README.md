## HTML Template Enhancer

***oHTML***, a HTML templating layer that eliminates the need for build tools by enabling reusable, component-based structures directly in HTML, reducing complexity in static site development.

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
<template id="generic-triple">
  <div><div><div>
    <slot></slot>
  </div></div></div>
</template>

<template id="triple-div">
  <div>
    <slot name-bind="title"></slot>
    <div>
      <slot name-bind="semi-title"></slot>
      <div>
        <slot name-bind="description"></slot> 
      </div>
    </div>
  </div>
</template>

<template id="user-list" data-use-shadow="false">
  <ul o-if="active">
    <li o-for="user in users" class="user-item" attr-pointer="user.styling">
      <h3 data-bind="user.name" style="margin: 0;"></h3>
      <p data-bind="user.email" style="margin: 5px 0; color: #666;"></p>
    </li>
  </ul>
</template>
```

using it:
```html
<generic-triple>
  <p>This paragraph is inside of 3 div's.</p>
</generic-triple>

<triple-div>
  <h2 slot="title">Rafael</h2>
  <p slot="semi-title">C. Science Student</p>
  <p slot="description">Hi! My name is Rafael and I desire to become a Software Enginner!</p>
</triple-div>

<user-list :active="true" 
  :users='[
    {"name": "Rafael Engel", "email": "rafael@gmail.com", "styling": {"style": "color: #2563eb; font-weight: bold;", "title": "Full Stack Developer"}},
    {"name": "Daniel Dias", "email": "daniel@gmail.com", "styling": {"style": "color: #dc2626; font-weight: bold;", "title": "Backend Developer"}},
    {"name": "João Silva", "email": "joao@gmail.com", "styling": {"style": "color: #059669; font-weight: bold;", "title": "Frontend Developer"}},
    {"name": "Maria Santos", "email": "maria@gmail.com", "styling": {"style": "color: #7c3aed; font-weight: bold;", "title": "QA Engineer"}}
  ]'></user-list>
```