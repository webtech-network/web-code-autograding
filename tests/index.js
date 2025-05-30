const fs = require('fs');
const process = require('process');

const validateGit = require('./validateGIT');
const validateHTML = require('./validateHTML');
const validateCSS = require('./validateCSS');
const validateJS = require('./validateJS');

function loadFile(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

// Função para carregar o arquivo de configuração
let descriptor = null;
function loadDescriptor() {
    if (!descriptor) {
        try {
            descriptor = JSON.parse(fs.readFileSync(`${process.env.GITHUB_WORKSPACE}/.github/test-config.json`, 'utf-8'));
        }
        catch (error) {
            console.error('Erro ao carregar o arquivo de configuração:', error);
            descriptor = {};
        }
    }
    return descriptor;
}      


function validateHTMLFile() {
    const descriptor = loadDescriptor();
    const html = loadFile(`${process.env.GITHUB_WORKSPACE}/public/index.html`);
    return validateHTML(html, descriptor.html);
}

function validateCSSFile() {
    const descriptor = loadDescriptor();
    const css = loadFile(`${process.env.GITHUB_WORKSPACE}/public/styles.css`);
    return validateCSS(css, descriptor.css);
}

function validateJSFile() {
    const descriptor = loadDescriptor();
    const js = loadFile(`${process.env.GITHUB_WORKSPACE}/public/app.js`);
    return validateJS(js, descriptor.js);
}

function validateGITRepo() {
    const descriptor = loadDescriptor();
    return validateGit(descriptor.git);
}

module.exports = {
    validateHTMLFile,
    validateCSSFile,
    validateJSFile,
    validateGITRepo
};