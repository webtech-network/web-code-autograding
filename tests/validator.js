const fs = require('fs');
const path = require('path');

const validateHTML = require('./validateHTML');
const validateCSS = require('./validateCSS');
const validateJS = require('./validateJS');

function loadFile(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

function loadDescriptor() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-config.json'), 'utf-8'));
}

function validateHTMLFile() {
    const descriptor = loadDescriptor();
    const html = loadFile(path.join(__dirname, '../src/index.html'));
    return validateHTML(html, descriptor.html);
}

function validateCSSFile() {
    const descriptor = loadDescriptor();
    const css = loadFile(path.join(__dirname, '../src/style.css'));
    return validateCSS(css, descriptor.css);
}

function validateJSFile() {
    const descriptor = loadDescriptor();
    const js = loadFile(path.join(__dirname, '../src/app.js'));
    return validateJS(js, descriptor.js);
}

module.exports = {
    validateHTMLFile,
    validateCSSFile,
    validateJSFile
};