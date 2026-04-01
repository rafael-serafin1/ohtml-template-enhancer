# Model-Link Feature Tests

This directory contains test files for the `model-link` attribute functionality.

## Files

### `test-model-link.html`
Comprehensive test suite with 4 different test scenarios:

1. **Test 1: Basic model-link**
   - Input with initial value "Rafael"
   - Data-bind showing synchronized value
   - Tests basic two-way binding

2. **Test 2: model-link with empty initial value**
   - Input starts empty
   - Tests data binding with no initial state

3. **Test 3: model-link with parsed data**
   - Uses `:data` attribute for JSON parsing
   - Tests complex data type synchronization

4. **Test 4: Multiple model-link inputs**
   - Two independent inputs in one component
   - Tests that each input synchronizes independently

### `simple-test.html`  
Minimal test file for quick debugging:
- Single component with one model-link input
- One data-bind display
- Good for testing basic functionality

## How to Run Tests

1. Open either HTML file in a web browser (Chrome, Firefox, Safari, Edge)
2. Interact with the inputs to verify:
   - ✅ Input shows initial value
   - ✅ Typing updates the display
   - ✅ Value synchronization works smoothly
   - ✅ Multiple inputs work independently

## Expected Behavior

### Input → State → Display Flow
```
User types → input event fires → component attribute updated → 
component re-renders → input value restored → data-bind updates
```

### Key Points to Check
- Inputs initialize with correct values
- Typing in input updates the display
- Display reflects the current input value
- Multiple inputs don't interfere with each other
- Component remains responsive during typing

## Browser Console

Check the browser console (F12) for:
- Any warning messages about unsupported elements
- Component registration confirmations
- Error tracking
