const fs = require('fs');
const path = require('path');
const validateHTML = require('./validateHTML');
const validateCSS = require('./validateCSS');

function loadFile(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

function loadDescriptor() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-config.json'), 'utf-8'));
}
const descriptor = loadDescriptor();

// Validacão do HTML
const html = loadFile(path.join(__dirname, '../public/index.html'));
let result = validateHTML(html, descriptor.html);
console.log("Resultados HTML:", result);

// Validacão do CSS
const css = loadFile(path.join(__dirname, '../public/style.css'));
result = validateCSS(css, descriptor.css);
console.log("Resultados CSS:", result);