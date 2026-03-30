## Mini HTML Framework

A **mini HTML framework** that enables the creation of **custom tags** easily and efficiently using:
```html 
<template>
```

---

### Features

- Create **custom elements** without any external dependencies.  
- Supports **HTML templates** to define the structure of your custom tags.  
- Minimalist API designed for **simplicity and speed**.  
- Easy to integrate into any web project.

---

### Installation

Include the framework script in your project:

```html
<script type="module" src="ohtml-framework/core/runtime.js"></script>
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

---

### Dynamic Class Assignment with `class-pointer`

The `class-pointer` attribute enables dynamic CSS class assignment, making it perfect for integrating with **TailwindCSS** and other utility-based CSS frameworks. This allows you to define different styles for the same component in different use cases.

#### How it works:

1. Add `class-pointer="pointer-name"` to elements inside your template
2. Pass classes through component attributes using the pointer name
3. Classes will be applied dynamically to the corresponding elements

#### Example with TailwindCSS:

**Template Definition:**
```html
<template id="user-card">
    <div class="main-user-card">
        <h2 data-bind="name" class-pointer="user-name"></h2>
        <p data-bind="email" class-pointer="user-email"></p>
    </div>
</template>
```

**Component Usage:**
```html
<!-- First card with blue heading and light gray text -->
<user-card 
    name="Daniel Dias" 
    email="daniel@gmail.com"
    user-name="font-bold text-blue-300"
    user-email="text-gray-200 font-light">
</user-card>

<!-- Same component with different styles -->
<user-card 
    name="John Smith" 
    email="john@gmail.com"
    user-name="font-semibold text-green-400"
    user-email="text-white">
</user-card>
```

#### Key Differences:

- **`class`** → Static, immutable. Applied once to all instances.
- **`class-pointer`** → Dynamic, mutable per instance. Allows unique styling for each component usage.

This feature is designed to work seamlessly with **data-bind** attributes, enabling both content and styling flexibility.