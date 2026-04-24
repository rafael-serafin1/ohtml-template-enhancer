export function nameIsString(name) {
    if (!name || typeof name !== 'string') {
        throw new Error('Must be a valid string as component name');
        return false;
    }
    return true;
}

export function nameIsOK(name, templateId) {
    if (!name || !name.includes("-")) {
        throw new Error(`Hyphen is required at tag's name.\nTemplate's id: "${templateId}"\n`);
        return false;
    }
    return true;
}

/**
 * 
 * @param {*} attr - attribute
 * @returns all values inside parameter
 * @var {*} values possible values ["src"...]
 */
export function attrDefineValues(attr) {
    /**
     * @type src ---> Searchs for source passed by a path. Example: src="./templates.html"
     * @type 
     */
    const values = ["src"];
    let attrValues = [];
    values.forEach(value => {
        if (attr.includes(`${value}`)) attrValues.push(value);
    });
    return attrValues;
}