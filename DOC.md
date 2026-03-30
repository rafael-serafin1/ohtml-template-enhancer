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
- **Booleans**: `:active="true"` → `true` (boolean) 
- **Objects**: `:metadata="{\"role\": \"admin\"}"` → `{ role: "admin" }` (object)
- **Arrays**: `:tags="[\"js\", \"html\"]"` → `["js", "html"]` (array)
- **Strings** (without prefix): `user-name="John"` → `"John"` (string)

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