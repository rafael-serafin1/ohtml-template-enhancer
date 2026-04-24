/**
 * Parse component attributes with semantic prefix support
 * The `:` prefix activates intelligent parsing for type conversion
 * 
 * @param {string} attrName - The attribute name (may contain `:` prefix)
 * @param {string} attrValue - The attribute value as string
 * @returns {object} Object containing { name, value, isParsed }
 * 
 * Examples:
 * - parseAttribute("name-id", "userName") -> { name: "name-id", value: "userName", isParsed: false }
 * - parseAttribute(":email-id", "3223455") -> { name: "email-id", value: 3223455, isParsed: true }
 * - parseAttribute(":data", "{\"key\": \"value\"}") -> { name: "data", value: { key: "value" }, isParsed: true }
 * - parseAttribute(":active", "true") -> { name: "active", value: true, isParsed: true }
 */
export function parseAttribute(attrName, attrValue) {
    const isPrefixed = attrName.startsWith(':');
    const name = isPrefixed ? attrName.slice(1) : attrName;
    
    if (!isPrefixed) 
        // No prefix: return as string
        return { name, value: attrValue, isParsed: false };
    
    // Has prefix: parse as JSON
    try {
        const parsedValue = JSON.parse(attrValue);
        return { name, value: parsedValue, isParsed: true };
    } catch (error) {
        console.warn(`Failed to parse attribute ":${name}" with value "${attrValue}". Treating as string.`, error);
        return { name, value: attrValue, isParsed: false };
    }
}

/**
 * Parse all component attributes
 * @param {HTMLElement} element - The custom element
 * @returns {object} Object with parsed attribute values, keyed by attribute name
 */
export function parseComponentAttributes(element) {
    const attributes = {};
    
    for (let attr of element.attributes) {
        const { name, value } = parseAttribute(attr.name, attr.value);
        attributes[name] = value;
    }
    
    return attributes;
}

/**
 * Get only the attributes that should be observed (without the `:` prefix)
 * @param {Set} attributeNames - Set of all attribute names (may include prefixed names)
 * @returns {Set} Set of clean attribute names without prefix
 */
export function getCleanAttributeNames(attributeNames) {
    return new Set(
        [...attributeNames].map(name => name.startsWith(':') ? name.slice(1) : name)
    );
}