const fs = require('fs');
const path = require('path');
const validateHTML = require('./validateHTML');

function loadFile(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

function loadDescriptor() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-config.json'), 'utf-8'));
}
const descriptor = loadDescriptor();
const html = loadFile(path.join(__dirname, '../public/index.html'));

let result = validateHTML(html, descriptor.html);

console.log("Resultados HTML:", result);
