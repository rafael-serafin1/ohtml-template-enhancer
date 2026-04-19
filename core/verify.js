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