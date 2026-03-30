## oHTML Template Enhancer

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

### Dynamic Class Assignment with `class-pointer`

The `class-pointer` attribute enables dynamic CSS class assignment, making it perfect for integrating with **TailwindCSS** and other utility-based CSS template enhancers. This allows you to define different styles for the same component in different use cases.

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

***be careful!*** -- `data-use-shadow` must be ***false*** so that you can use external CSS.<br />
Otherwise use `<style>` inside `<template>` for inline styling.

--- 

### Dynamic Id Assignment with `id-pointer`

The `id-pointer` attribute enables dynamic id assignment, making it perfect for working with ***JavaScript*** and ***frontend*** functionality.

#### How it works:

1. Add `id-pointer="pointer-name"` to elements inside your template
2. Pass id's through component attributes using the pointer name
3. Id's will be applied dynamically to the corresponding elements

#### Example:

**Template Definition:**
```html
<template id="user-card">
    <div class="main-user-card">
        <h2 data-bind="name" id-pointer="name-id"></h2>
        <p data-bind="email" id-pointer="email-id"></p>
    </div>
</template>
```

**Component Usage:**
```html
<user-card 
    name="Daniel Dias" 
    email="daniel@gmail.com"
    name-id="userName"
    email-id="userEmail">
</user-card>
```

#### Key Differences:

- **`id`** → Static, immutable. Applied once to all instances.
- **`id-pointer`** → Dynamic, mutable per instance. 

This feature is designed to work seamlessly with **data-bind** attributes, enabling both content and styling flexibility.

---

### Intelligent Type Parsing with `:` Prefix

The `:` prefix enables intelligent type parsing for attribute values. By default, all attribute values are treated as strings. With the `:` prefix, values are parsed as JSON, allowing you to pass **numbers**, **booleans**, and **objects** to your components.

#### How it works:

1. Add the `:` prefix to any attribute name
2. The value will be parsed as JSON (numbers, booleans, objects, arrays, etc.)
3. If parsing fails, the value is treated as a string with a console warning
4. The parsed value is available through the component's `getData()` method

#### Supported Types:

- **Numbers**: `:user-id="12345"` → `12345` (number)
- **Strings** (without prefix): `user-name="John"` → `"John"` (string)
- **Booleans**: `:active="true"` → `true` (boolean) 
- **Arrays**: `:tags="[\"js\", \"html\"]"` → `["js", "html"]` (array)
- **Objects**: `:metadata="{\"role\": \"admin\"}"` → `{ role: "admin" }` (object)

#### Example:

**Template Definition:**
```html
<template id="user-card">
    <div class="main-user-card">
        <h2 data-bind="name" id-pointer="name-id"></h2>
        <p data-bind="email" id-pointer="email-id"></p>
        <!-- :user-id expects a number, :metadata expects an object -->
        <span data-bind="role"></span>
    </div>
</template>
```

**Component Usage:**
```html
<!-- Using intelligent parsing with prefixed attributes -->
<user-card 
    name="Daniel Dias" 
    email="daniel@gmail.com"
    name-id="user-daniel"
    :email-id="123456"
    :active="true"
    :metadata="{\"role\": \"admin\", \"level\": 5}">
</user-card>

<!-- Mix of regular and parsed attributes -->
<user-card 
    name="John Smith" 
    email="john@gmail.com"
    name-id="user-john"
    :email-id="789012"
    :active="false"
    :metadata="{\"role\": \"user\"}">
</user-card>
```

#### Accessing Parsed Values in JavaScript:

```javascript
const card = document.querySelector('user-card');

// Get the parsed email-id (number)
const emailId = card.getData('email-id'); // 123456

// Get the parsed metadata (object)
const metadata = card.getData('metadata'); // { role: "admin", level: 5 }

// Get regular string value
const nameId = card.getData('name-id'); // "user-daniel"
```

#### Key Points:

- **Conversions happen automatically** - use the `:` prefix to activate JSON parsing
- **Type safety** - ideal for passing configuration objects or numeric IDs to components
- **Error handling** - malformed JSON falls back to string with a warning
- **Storage** - parsed values are stored internally in the component's `_componentData` object
- **Accessibility** - use `getData(attrName)` method to retrieve parsed values programmatically

---

### Boolean State Provider

The `boolean-state` provides a boolean value declared inline.

#### Example:

```html
<template>
    <div class="main-user-card">
        <h1 data-bind="name" id-pointer="name-id" class-pointer="user-name"></h1>
        <p data-bind="email" id-pointer="email-id" class-pointer="user-email"></p>
        <p data-bind="logged" boolean-state="active" id-pointer="log"></p>
    </div>
</template>
```

---

### If statement (Conditional Rendering)

The `o-if` attribute enables conditional rendering of elements based on boolean values. Elements with `o-if` will only appear if the referenced attribute is `true`, and will be hidden if it's `false`.

#### How it works:

1. Add `o-if="attribute-name"` to elements inside your template
2. Pass a **boolean** value via the component attribute using the `:` prefix (e.g., `:active="true"`)
3. The element will be shown or hidden based on the boolean value
4. If the referenced attribute is not a boolean, an error is logged and the element is hidden

#### Important Rules:

- ❌ **Must use `:` prefix** → `o-if` requires boolean values from JSON parsing
- ❌ **No string booleans** → `active="true"` (without `:`) will cause an error
- ✅ **Correct usage** → `:active="true"` (with `:` prefix)

#### Example:

**Template Definition:**
```html
<template id="user-card">
    <div class="main-user-card">
        <h2 data-bind="name" id-pointer="name-id"></h2>
        <p data-bind="email" id-pointer="email-id"></p>
        <!-- This element only shows if 'active' is true -->
        <p data-bind="logged" o-if="active"></p>
    </div>
</template>
```

**Component Usage - CORRECT:**
```html
<!-- Element will be VISIBLE (active is true) -->
<user-card 
    name="Daniel Dias" 
    email="daniel@gmail.com"
    name-id="userName" 
    :email-id="3223455" 
    :active="true">
</user-card>

<!-- Element will be HIDDEN (active is false) -->
<user-card 
    name="Gabriel Dias" 
    email="gabriel@gmail.com"
    name-id="userName" 
    :email-id="3223456" 
    :active="false">
</user-card>
```

**Component Usage - INCORRECT:**
```html
<!-- ❌ ERROR: 'active' is a string, not a boolean -->
<!-- Console error will be logged -->
<!-- Element will be hidden -->
<user-card 
    name="Rafael Braga" 
    email="rafael@gmail.com"
    name-id="userName" 
    :email-id="3223457" 
    active="true">  <!-- Missing : prefix! -->
</user-card>
```

#### Error Message:

If you forget the `:` prefix, you'll see this error:

```
[oHTML o-if Error] Attribute "active" used in o-if must be a boolean. 
Current value is string. 
Use the ":" prefix to enable JSON parsing (e.g., :active="true")
```

#### Key Points:

- **Boolean-only** - `o-if` will reject non-boolean values with an error
- **Hidden, not removed** - Elements are hidden with `display: none`, keeping the DOM structure intact
- **Dynamic updates** - If the attribute changes, the visibility updates automatically
- **Works with other bindings** - Can be combined with `data-bind`, `class-pointer`, `id-pointer`, etc.

---

### List Rendering with `o-for`

The `o-for` attribute enables rendering of lists by iterating over arrays. Similar to Vue's `v-for` or Angular's `*ngFor`, it allows you to render multiple elements dynamically based on array data.

#### How it works:

1. Add `o-for="item in arrayName"` to an element in your template
2. Pass an array through a component attribute using JSON parsing (`:` prefix)
3. The element is cloned for each item in the array
4. Inside the loop, reference item properties with `item.property` syntax

#### Syntax:

```
o-for="itemName in arrayAttributeName"
```

- **itemName** - Variable name for the current item in the loop
- **arrayAttributeName** - The component attribute containing the array data
- Must use `:` prefix when passing the array (e.g., `:users="[...]"`)

#### Example:

**Template Definition:**
```html
<template id="user-list" data-use-shadow="false">
    <ul>
        <li o-for="user in users">
            <h3 data-bind="user.name"></h3>
            <p data-bind="user.email"></p>
        </li>
    </ul>
</template>
```

**Component Usage:**
```html
<user-list :users='[
    {"name": "Rafael", "email": "rafael@gmail.com"},
    {"name": "Daniel", "email": "daniel@gmail.com"},
    {"name": "João", "email": "joao@gmail.com"}
]'></user-list>
```

#### Features:

- **Property Access** - Use dot notation for nested properties: `user.name`, `user.profile.email`
- **Works with Bindings** - Combine with `data-bind`, `class-pointer`, `id-pointer`
- **Dynamic** - Array updates trigger re-rendering
- **Cloning** - Original element structure is preserved and cloned for each item

#### Advanced Example:

```html
<template id="product-list" data-use-shadow="false">
    <div class="products">
        <article o-for="product in items" class-pointer="product.category">
            <h4 data-bind="product.name"></h4>
            <p data-bind="product.description"></p>
            <span data-bind="product.price" id-pointer="product.id"></span>
        </article>
    </div>
</template>

<!-- Usage with object properties -->
<product-list :items='[
    {
        "id": 1,
        "name": "Laptop",
        "description": "High performance laptop",
        "category": "electronics",
        "price": "$999"
    },
    {
        "id": 2,
        "name": "Mouse",
        "description": "Wireless mouse",
        "category": "accessories",
        "price": "$29"
    }
]'></product-list>
```

#### Key Points:

- **Array Required** - `o-for` only works with array values passed via `:` prefix (JSON parsing)
- **Proper Nesting** - Reference nested properties with dot notation (e.g., `user.address.city`)
- **No Indices** - Current version does not provide item index (planned feature)
- **Data-use-shadow** - Recommended to set `data-use-shadow="false"` for better CSS integration
- **Error Handling** - Non-array values will log an error and skip rendering 