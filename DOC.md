## oHTML Template Enhancer

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

### Dynamic Attributes Assignment with `attr-pointer`

The `attr-pointer` attribute enables dynamic attribute assignment to elements. This allows you to pass HTML attributes (style, class, title, data-*, etc.) dynamically from component attributes.

#### How it works:

1. Add `attr-pointer="pointername-PROP"` to elements inside your template
2. Pass attributes through component attributes using the pointer name
3. Attributes are applied dynamically to the corresponding elements

#### Example:

**Template Definition:**
```html
<template id="user-card" data-use-shadow="false">
    <div class="user-item">
        <h2 data-bind="name" attr-pointer="name-style, name-title"></h2>
        <p data-bind="email" attr-pointer="email-style, email-title"></p>
    </div>
</template>
```

**Component Usage - String Format:**
```html
<user-card 
    name="Rafael" 
    email="rafael@gmail.com"
    :name-style="style='color: gold; font-weight: bold;' title='User name'"
    name-title="Software Developer"
    :email-style="style='color: gray; font-style: italic;' title='Email address'"
    email-title="User email adress">
</user-card>
```

#### Key Points:

- **Flexible Format** - Choose between string, object, or array format depending on your needs
- **Special Style Handling** - `style` attributes are applied via `cssText` for better CSS support
- **Type Safety** - Use `:` prefix for objects/arrays to enable JSON parsing
- **Direct Attributes** - Perfect for setting `title`, `aria-*`, `data-*` attributes dynamically
- **Works with o-for** - Can reference nested properties like `item.attrs` inside loops
- **CSS Classes** - For dynamic classes, prefer `class-pointer` over `attr-pointer` for better semantics

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

### Conditional Rendering with `o-if`

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

---

### Event Handling with `o-when`

The `o-when` attribute enables event handling by attaching event listeners to custom components. When a specified event occurs, a global function is called with the component as context.

#### How it works:

1. Declare a global function in your JavaScript (attached to `window` object)
2. Add `o-when:eventName="functionName"` to your component tag
3. When the event fires, the function is called with `this` bound to the component
4. Currently supported events: `click`, `dblclick`, `change`, `input`

#### Syntax:

```
o-when:eventName="functionName"
```

- **eventName** - One of: `click`, `dblclick`, `change`, `input`
- **functionName** - Name of a global function to call when the event fires
- Function must be accessible via `window.functionName`

#### Example:

**JavaScript - Define global handler:**
```javascript
window.handleCardClick = function() {
    // 'this' refers to the component element
    const name = this.getAttribute('name');
    const email = this.getAttribute('email');
    console.log(`Clicked on ${name} (${email})`);
    alert(`User: ${name}`);
};

window.handleCardDblClick = function() {
    console.log('Double clicked!');
};
```

**HTML - Use o-when on component:**
```html
<user-card 
    name="Rafael" 
    email="rafael@gmail.com"
    o-when:click="handleCardClick"
    o-when:dblclick="handleCardDblClick"
    style="cursor: pointer;">
</user-card>
```

#### Supported Events:

- **`click`** - Single mouse click on the component
- **`dblclick`** - Double mouse click on the component
- **`change`** - Value change (useful for input components)
- **`input`** - Input event (real-time input feedback)

#### Example with Input Event:

**JavaScript:**
```javascript
window.handleFormInput = function(event) {
    const value = event.target.value;
    console.log('Input value:', value);
};
```

**HTML:**
```html
<my-input o-when:input="handleFormInput"></my-input>
```

#### Context Binding:

Inside the handler function, `this` refers to the component element. You can access component attributes and methods:

```javascript
window.handleCardClick = function() {
    // Access attributes
    const name = this.getAttribute('name');
    const email = this.getAttribute('email');
    
    // Get parsed data values
    const userId = this.getData('user-id');
    
    // Log component information
    console.log('Component tag:', this.tagName);
    console.log('Component name:', name);
};
```

#### Error Handling:

If the specified function is not found in the global scope, an error is logged:

```
[oHTML o-when Error] Function "handleClick" not found in window scope. 
Make sure the function is declared globally and is available before the component is initialized.
```

**Solutions:**
- Ensure the function is declared before the component is instantiated
- Make sure the function is attached to the `window` object
- Check for typos in the function name
- Use the browser's developer console to verify the function exists: `console.log(window.handleClick)`

#### Key Points:

- **Global scope** - Functions must be declared globally (on `window` object)
- **Order matters** - Define handlers before components are initialized
- **This binding** - Handler receives component as `this` context
- **Single handler per event** - Each event type can have one handler (subsequent declarations override)
- **Event object** - Event listeners receive the standard DOM event object: `function(event) { ... }`
- **No inline handlers** - Function names only, actual code cannot be inlined

#### Best Practices:

1. Define all handlers in a separate script or module:
```html
<script>
    window.handleCardClick = function() { ... };
    window.handleFormInput = function() { ... };
</script>
<script type="module" src="core/runtime.js"></script>
```

2. Use meaningful function names that describe the action:
```html
<!-- Good -->
<user-card o-when:click="openUserProfile"></user-card>

<!-- Less clear -->
<user-card o-when:click="handle"></user-card>
```

3. Access component data within handlers:
```javascript
window.handleUserCardClick = function() {
    const userData = {
        name: this.getAttribute('name'),
        email: this.getAttribute('email'),
        userId: this.getData('user-id') // Parsed data
    };
    
    sendToServer(userData);
};
```

---

### Slot dynamic content association   

Using `name-bind` as a atribute for `<slot>` element, it is possible to add content to it dynamically by calling its name within the element.

#### Usage:

```html
<template id="user-card">
    <div>
        <header><slot name-bind="header"></slot></header>
        <section><slot name-bind="main"></slot></section>
    </div>
</template>

<user-card>
    <h2 slot="header">Title</h2>
    <p slot="main">Main description...</p>
</user-card>
```

---

### Two-Way Data Binding with `model-link`

The `model-link` attribute enables two-way data binding on input elements, synchronizing automatically between the input value and the component attribute. This is useful for form inputs, search boxes, and any scenario where you need real-time value synchronization without heavy framework overhead.

#### How it works:

1. Add `model-link="propertyName"` to input elements inside your template
2. The input is automatically initialized with the component attribute value
3. When the user types, the component attribute is updated in real-time
4. When the component attribute changes (from JavaScript or elsewhere), the input value updates
5. Works alongside `data-bind` for displaying the synchronized value

#### Syntax:

```html
<input model-link="propertyName" placeholder="Type here..."/>
```

#### Supported Elements:

- `<input>` - Text, email, number, password, etc.
- `<textarea>` - Multi-line text input
- `<select>` - Dropdown selection

#### Example: Basic Input Synchronization

**Template Definition:**
```html
<template id="search-box">
    <div>
        <input model-link="query" placeholder="Search..."/>
        <p>Search for: <strong data-bind="query"></strong></p>
    </div>
</template>
```

**Component Usage:**
```html
<!-- Input starts with "javascript" -->
<search-box query="javascript"></search-box>
```

**Behavior:**
- Input shows "javascript" initially
- Typing "react" in the input updates the query attribute
- The `<p>` text updates to "Search for: react" in real-time

#### Example: Form with Multiple Inputs

**Template Definition:**
```html
<template id="contact-form" data-use-shadow="false">
    <form>
        <div>
            <label>Name:</label>
            <input model-link="name" placeholder="Full name"/>
        </div>
        <div>
            <label>Email:</label>
            <input model-link="email" placeholder="Email address"/>
        </div>
        <div style="background: #f5f5f5; padding: 10px; margin-top: 10px;">
            <p>Name: <strong data-bind="name"></strong></p>
            <p>Email: <strong data-bind="email"></strong></p>
        </div>
    </form>
</template>
```

**Component Usage:**
```html
<contact-form name="João Silva" email="joao@example.com"></contact-form>
```

#### Interaction Flow:

1. **User types in input** → `handleInput` event listener triggers
2. **Component attribute updated** → `setAttribute()` is called
3. **Change detected** → `attributeChangedCallback()` is invoked
4. **Component re-renders** → `render()` is called
5. **Input value restored** → `_applyModelLink` re-initializes with updated value
6. **Display updates** → `data-bind` elements reflect the new value

#### JavaScript Integration:

```javascript
// Get the component
const form = document.querySelector('contact-form');

// Read current values
const name = form.getAttribute('name');
const email = form.getAttribute('email');

// Update values programmatically
form.setAttribute('name', 'Maria Santos');
form.setAttribute('email', 'maria@example.com');

// Both the inputs and data-bind elements will update automatically
```

#### Key Characteristics:

- ✅ **Lightweight** - No heavy framework needed, pure vanilla JavaScript
- ✅ **Bidirectional** - Input → attribute → display automatic synchronization
- ✅ **Preserves HTML semantics** - Uses native input elements and events
- ✅ **Works with data-bind** - Combines perfectly with content binding
- ✅ **Event-driven** - Uses native `input` event for real-time synchronization
- ❌ **Re-renders on change** - Component re-renders when attribute updates (trade-off for simplicity)

#### Important Notes:

1. **Cursor position** - Input loses focus/cursor position on re-render (expected behavior)
2. **Debouncing** - Not built-in; use external debouncing if needed
3. **Validation** - Not included; implement validation separately
4. **Parsed attributes** - Use prefixed attributes (`:`) for complex data types with caution
5. **Performance** - Each keystroke triggers a re-render; useful for moderate form sizes

#### Example: Form with Event Handling

**JavaScript:**
```javascript
window.submitForm = function() {
    const name = this.getAttribute('name');
    const email = this.getAttribute('email');
    console.log('Form submitted:', { name, email });
    // Send to server, etc.
};
```

**HTML:**
```html
<contact-form 
    name="" 
    email=""
    o-when:change="submitForm"
    style="cursor: pointer;">
</contact-form>
```
