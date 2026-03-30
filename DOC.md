## oHTML Framework

### How to use it

Clone oHTML repository:<br />
*git clone https://github.com/rafael-serafin1/ohtml-mini-framework*

On your HTML file:
```html
<script type="module" src="ohtml-mini-framework/core/runtime.js"></script>
```

And its done! You can follow the next step now.

---

### How to create your custom tag

Using `<template>`
```html
<template id="my-tag">        <!-- '-' are mandatory for custom tag's name-->
    <div>
        <hr /><br />
    </div>
</template>
```

This is a basic custom tag that creates a horizontal line on your application.

---

### Mutable content

Using the special `data-bind` attribute, it's possible to shape the content of child elements during the declaration of the custom tag.

On `<template>`
```html
<template id="user-card">
    <div class="main-content-user-card">
        <h2 data-bind="name"></h2>
        <p data-bind="email"></p>
    </div>
</template>
```

On usage:
```html 
<user-card name="Daniel Dias" email="danieldias@email.com"></user-card>
```

--- 

### Class Pointers

`class-pointer` allows dynamic class assignment from component attributes. For an example:

```html
<template id="user-card" data-use-shadow="false">
    <div class="main-content-user-card">
        <h2 data-bind="name" class-pointer="user-name"></h2>
        <p data-bind="email" class-pointer="user-email"></p>
    </div>
</template>
```

On usage:
```html
    <user-card name="Daniel Dias" email="danieldias@email.com"
    user-name="user-name-display" user-email="user-email-display"></user-card>
```

***be careful!*** -- `data-use-shadow` must be ***false*** so that you can use external CSS.<br />
Otherwise use `<style>` inside `<template>` for inline styling.

---

### Id Pointers

`id-pointer` allows dynaic id assignment by component attributes. For example:

```html
<template id="user-card" data-use-shadow="false">
    <div class="main-content-user-card">
        <h2 data-bind="name" id-pointer="name-id"></h2>
        <p data-bind="email" id-pointer="email-id"></p>
    </div>
</template>
```

On usage:
```html
    <user-card name="Daniel Dias" email="danieldias@email.com"
    name-id="userName" email-id="userEmail"></user-card>
```