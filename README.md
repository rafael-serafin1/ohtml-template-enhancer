## Mini HTML Framework

A **mini HTML framework** that enables the creation of **custom tags** easily and efficiently using:
```html 
<template>
```

---

## Features

- Create **custom elements** without any external dependencies.  
- Supports **HTML templates** to define the structure of your custom tags.  
- Minimalist API designed for **simplicity and speed**.  
- Easy to integrate into any web project.

---

## Installation

Include the framework script in your project:

```html
<script type="module" src="ohtml-framework/core/runtime.js"></script>
```

---

## Basic Usage

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